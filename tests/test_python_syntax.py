"""Keep preserved Python helpers parseable without importing optional dependencies."""
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parent.parent


class PythonSyntaxTests(unittest.TestCase):
    def test_canonical_helpers_parse(self):
        for folder in ['skills', 'scripts', 'tests']:
            for file in (ROOT / folder).rglob('*.py'):
                with self.subTest(file=str(file.relative_to(ROOT))):
                    compile(file.read_bytes(), str(file), 'exec')


if __name__ == '__main__':
    unittest.main()
