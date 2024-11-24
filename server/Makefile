install:
	npm install

build:
	npm run build

db/up:
	docker compose up -d --build

db/down:
	docker compose down

db/destroy:
	docker compose down -v

load-data:
	ts-node scripts/load_stackoverflow_postgres.ts

start: build
	npm run start

watch:
	npm run start-watch
