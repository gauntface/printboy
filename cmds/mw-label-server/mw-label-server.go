package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/gauntface/miniworks-label-print-server/handlers/api/print"
	"github.com/gauntface/miniworks-label-print-server/handlers/staticfiles"
	"github.com/gauntface/miniworks-label-print-server/runtime/staticassets"
)

var (
	port = flag.String("port", "9000", "the port to run the server on")
)

func main() {
	c := new()
	if err := c.run(); err != nil {
		fmt.Printf("Run was not sucessful: %v\n", err)
		os.Exit(1)
	}
}

type client struct{}

func new() *client {
	return &client{}
}

func (c *client) run() error {
	assetsDir, err := staticassets.Init()
	if err != nil {
		return fmt.Errorf("failed to get static assets: %w", err)
	}

	fmt.Printf("📂 Static Assets: %v\n", assetsDir)

	http.Handle("/api/print", print.BuildHandler())
	http.Handle("/", staticfiles.BuildHandler(assetsDir))

	fmt.Printf("Listening on port %v\n", *port)
	err = http.ListenAndServe(fmt.Sprintf(":%v", *port), nil)
	if err != nil {
		return fmt.Errorf("failed to start server on port %v: %w", *port, err)
	}
	return nil
}
