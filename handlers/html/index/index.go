package index

import (
	"encoding/base64"
	"io/ioutil"
	"net/http"
	"strings"
)

func BuildHandler() http.Handler {
	return &handler{}
}

type handler struct{}

func (h handler) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("Hi"))
}

func writeFile(b64 string) (string, error) {
	b64 = strings.TrimPrefix(b64, "data:image/png;base64,")
	dec, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		return "", err
	}

	f, err := ioutil.TempFile("", "mw-label.*.png")
	if err != nil {
		return "", err
	}
	defer f.Close()

	if _, err := f.Write(dec); err != nil {
		return "", err
	}
	if err := f.Sync(); err != nil {
		return "", err
	}
	return f.Name(), nil
}

type payload struct {
	Base64EncodedImage string
}

type response struct {
	Success bool
}
