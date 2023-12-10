// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import '../config/env.js'
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import { hooks as schemaHooks } from '@feathersjs/schema'
import { configurationValidator } from './configuration'
import type { Application } from './declarations'
import { logError } from './logger'
import { mongodb } from './mongodb'
import { authentication } from './authentication'
import { services } from './services'
import { channels } from './channels'
import { appCreateResolver, appPatchResolver } from './app.schema'
import { feathersCasl } from 'feathers-casl'

const app: Application = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins'),
    },
    maxHttpBufferSize: 1e8,
  }),
)
app.configure(feathersCasl({ defaultAdapter: '@feathersjs/mongodb' }))
app.configure(channels)
app.configure(mongodb)
app.configure(authentication)
app.configure(services)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError],
  },
  before: {
    create: [schemaHooks.resolveData(appCreateResolver)],
    patch: [schemaHooks.resolveData(appPatchResolver)],
  },
  after: {},
  error: {},
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: [],
})

export { app }
