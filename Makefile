up:
	docker compose up -d --build

down:
	docker compose down

destroy:
	docker compose down -v

load-data:
	ts-node scripts/load_stackoverflow_postgres.ts

start:
	npm run build && npm run start

start-watch:
	npm run start-watch

test:
	npm test
