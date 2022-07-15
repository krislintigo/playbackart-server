build:
	docker build -t pba-s .

run:
	docker run -d -p 3000:3000 --env-file .env --name pba-s pba-s
