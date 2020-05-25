package installassets

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

const (
	installdirname = ".mw-label-server"
	logosdirname   = "logos"
	titlesdirname  = "titles"
	contentdirname = "content"

	LogoAssetsRoute = "/install/logos/"
)

func LogosDir() (string, error) {
	h, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("unable to get the current home directory: %w", err)
	}

	return filepath.Join(h, installdirname, logosdirname), nil
}

func Logos() ([]Logo, error) {
	logoDir, err := LogosDir()
	if err != nil {
		return nil, err
	}

	files, err := filepath.Glob(logoDir + "/**/*.json")
	if err != nil {
		return nil, fmt.Errorf("unable to find logos: %w", err)
	}

	ls := []Logo{}
	for _, f := range files {
		c, err := ioutil.ReadFile(f)
		if err != nil {
			return nil, fmt.Errorf("failed to read %q: %w", f, err)
		}

		var l Logo
		if err = json.Unmarshal(c, &l); err != nil {
			return nil, fmt.Errorf("failed to parse %q: %w", f, err)
		}

		r, err := filepath.Rel(logoDir, filepath.Dir(f))
		if err != nil {
			return nil, fmt.Errorf("failed to get relative path from logo directory to logo image %q: %w", f, err)
		}
		l.ImagePath = filepath.Join(LogoAssetsRoute, r, l.ImagePath)

		fmt.Printf("Logo: %+v\n", l)
		ls = append(ls, l)
	}

	return ls, nil
}

type Logo struct {
	ID        string
	Name      string
	ImagePath string
}
