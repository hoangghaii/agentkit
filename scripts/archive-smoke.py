#!/usr/bin/env python3
"""Verify ZIP integrity, cleanup, extraction and installation without a Git checkout."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive', nargs='?', default=str(ROOT / 'dist/agentkit-engineer.zip'))
    args = parser.parse_args()
    archive = Path(args.archive)
    assert archive.with_suffix('.zip.sha256').read_text().split()[0] == hashlib.sha256(archive.read_bytes()).hexdigest()
    with tempfile.TemporaryDirectory(prefix='agentkit archive ') as temporary:
        folder = Path(temporary)
        with zipfile.ZipFile(archive) as bundle:
            assert bundle.testzip() is None, 'ZIP CRC failure'
            for name in bundle.namelist():
                relative = Path(name)
                assert not relative.is_absolute() and '..' not in relative.parts
                assert not any(part in {'node_modules', '__pycache__', '.git', 'coverage', 'claudekit-engineer-backup'} for part in relative.parts)
                assert relative.suffix not in {'.zip', '.gz', '.pyc', '.log'}
                assert not relative.name.startswith('.env') or relative.name == '.env.example'
            bundle.extractall(folder)
        source = folder / 'agentkit-engineer'
        # Reuse the verified, locked dependency installation; archive contains no node_modules.
        shutil.copytree(ROOT / 'node_modules', source / 'node_modules')
        def cli(*arguments):
            result = subprocess.run(['node', str(source / 'bin/agentkit.mjs'), *arguments],
                                    cwd=folder, capture_output=True, text=True, timeout=60)
            assert result.returncode == 0, result.stdout + result.stderr
            return json.loads(result.stdout)
        assert cli('validate')['ok']
        target = folder / 'new project with spaces'
        packs = 'core,web,backend-data,platform,documents,ai-media,quality'
        assert cli('install', '--target', str(target), '--packs', packs)['ok']
        assert cli('install', '--target', str(target), '--packs', packs)['actions'] == []
        assert cli('update', '--target', str(target), '--check', '--offline')['actions'] == []
        assert cli('uninstall', '--target', str(target))['ok']
        assert not (target / '.agentkit/manifest.json').exists()
    print(json.dumps({'ok': True, 'checks': ['checksum', 'ZIP CRC', 'cleanup', 'extract', 'validate', 'install all packs', 'reinstall', 'offline update', 'uninstall', 'no Git']}))


if __name__ == '__main__':
    main()
