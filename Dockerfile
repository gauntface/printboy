FROM alpine AS builder

COPY --from=golang:1.20-alpine /usr/local/go/ /usr/local/go/
ENV PATH="/usr/local/go/bin:${PATH}"
ENV GOPATH /go
ENV PATH $GOPATH/bin:$PATH
RUN mkdir -p "$GOPATH/src" "$GOPATH/bin" && chmod -R 777 "$GOPATH"

RUN go install github.com/gauntface/go-html-asset-manager/v5/cmds/htmlassets@latest

RUN apk update
RUN apk add nodejs npm hugo minify

COPY . /app
RUN cd /app; npm install
RUN cd /app; npm run build
RUN cd /app/build; npm install --production

FROM alpine
ARG PORT=8080
ENV PORT=$PORT
RUN apk add --update nodejs
COPY --from=builder /app/build /app
CMD node --version; node ./app/index.js
