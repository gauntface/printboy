package main

import (
	"flag"
	"fmt"
	"net/http"

	"github.com/gauntface/miniworks-label-print-server/handlers/api/print"
	"github.com/gauntface/miniworks-label-print-server/handlers/staticfiles"
)

var (
	port = flag.String("port", "9000", "the port to run the server on")
)

func main() {
	c := new()
	c.run()
}

type client struct{}

func new() *client {
	return &client{}
}

func (c *client) run() error {
	http.Handle("/api/print", print.BuildHandler())
	http.Handle("/", staticfiles.BuildHandler())

	fmt.Printf("Listening on port %v\n", *port)
	err := http.ListenAndServe(fmt.Sprintf(":%v", *port), nil)
	if err != nil {
		return fmt.Errorf("failed to start server on port %v: %w", *port, err)
	}
	return nil
}
