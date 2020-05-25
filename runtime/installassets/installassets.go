package installassets

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
)

const (
	installdirname  = ".mw-label-server"
	logosdirname    = "logos"
	contentsdirname = "contents"

	LogoAssetsRoute = "/install/logos/"
)

func installDir() (string, error) {
	h, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("unable to get the current home directory: %w", err)
	}
	return filepath.Join(h, installdirname), nil
}

func LogosDir() (string, error) {
	id, err := installDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(id, logosdirname), nil
}

func contentsDir() (string, error) {
	id, err := installDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(id, contentsdirname), nil
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

		ls = append(ls, l)
	}

	return ls, nil
}

func Contents() ([]Content, error) {
	contentsDir, err := contentsDir()
	if err != nil {
		return nil, err
	}

	files, err := filepath.Glob(contentsDir + "/*.json")
	if err != nil {
		return nil, fmt.Errorf("unable to find logos: %w", err)
	}

	cs := []Content{}
	for _, f := range files {
		fc, err := ioutil.ReadFile(f)
		if err != nil {
			return nil, fmt.Errorf("failed to read %q: %w", f, err)
		}

		var c Content
		if err = json.Unmarshal(fc, &c); err != nil {
			return nil, fmt.Errorf("failed to parse %q: %w", f, err)
		}

		cs = append(cs, c)
	}

	return cs, nil
}

type Logo struct {
	ID        string
	Name      string
	ImagePath string
}

type Content struct {
	ID    string
	Name  string
	Lines []Line
}

type Line struct {
	Text   string
	Weight string
}
