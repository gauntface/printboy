.PHONY: build clean gomodgen format getpkger

build: gomodget build-offline

build-offline: format
	export GO111MODULE=on 
	env GOOS=linux go build -ldflags="-s -w" -o ./bin/mw-label-server ./cmds/mw-label-server/mw-label-server.go


# NOTE: Add the `-test.v` flag for verbose logging.
test: build format
	mkdir -p coverage/
	go test ./... -covermode=atomic -coverprofile ./coverage/cover.out
	go tool cover -html=./coverage/cover.out -o ./coverage/cover.html

clean:
	rm -rf ./bin ./vendor Gopkg.lock

gomodget:
	go get -v all

format:
	go fmt ./...

server: build
	./bin/mw-label-server