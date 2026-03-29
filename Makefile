docker-build:
	docker build -t printboy .

docker-run:
	docker run --rm --name printboy -p 8080:8080 printboy

docker-cycle: docker-build docker-run

docker-stop:
	docker stop printboy

install:
	go install github.com/tdewolff/minify/v2/cmd/minify@latest
	go install github.com/gauntface/go-html-asset-manager/v5/cmds/htmlassets@latest
