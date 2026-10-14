"""Export packaged browser assets without running a development server."""

from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'src' / 'pymaster_ai' / 'static'
OUTPUT = ROOT / 'site-public'


def main():
    OUTPUT.mkdir(exist_ok=True)
    for source in SOURCE.iterdir():
        if source.is_file() and source.suffix in {'.html', '.js'}:
            shutil.copy2(source, OUTPUT / source.name)
    (OUTPUT / 'health').write_text('{"status":"ok","mode":"static-frontend"}\n', encoding='utf-8')
    print(f'Exported browser assets to {OUTPUT.name}')


if __name__ == '__main__':
    main()
