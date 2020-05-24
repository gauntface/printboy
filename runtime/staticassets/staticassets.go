package staticassets

import (
	"errors"
	"os"
	"path/filepath"
)

func Init() (string, error) {
	paths := []string{
		"static",
	}
	v, ok := os.LookupEnv("GOPATH")
	if ok {
		paths = append(paths, filepath.Join(v, "src", "github.com", "gauntface", "miniworks-label-print-server", "static"))
	}

	for _, p := range paths {
		_, err := os.Stat(p)
		if err != nil {
			if os.IsNotExist(err) {
				continue
			}
			return "", err
		}
		return p, nil
	}

	return "", errors.New("unable to find static dir")
}
