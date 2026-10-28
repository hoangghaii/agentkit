"""Regression checks for optional key lookup; never call an external API."""
import contextlib
import importlib.util
import io
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('api_key_helper', ROOT / 'skills/common/api_key_helper.py')
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


class APIKeyHelperTests(unittest.TestCase):
    def test_environment_key_returns_with_default_and_installed_layouts(self):
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ, {'GEMINI_API_KEY': 'fixture-value'}, clear=True):
            for prefix in ['skills', '.agents/skills', '.claude/skills']:
                skill = Path(directory) / prefix / 'example'
                skill.mkdir(parents=True)
                with contextlib.redirect_stderr(io.StringIO()) as error:
                    self.assertEqual(helper.get_api_key_or_exit(skill), 'fixture-value')
                    self.assertNotIn('fixture-value', error.getvalue())
            self.assertEqual(helper.get_api_key_or_exit(), 'fixture-value')

    def test_project_key_is_found_from_any_working_directory(self):
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ, {}, clear=True):
            root = Path(directory)
            for prefix in ['skills', '.agents/skills', '.claude/skills']:
                skill = root / prefix / 'example'
                skill.mkdir(parents=True)
                (root / '.env').write_text('GEMINI_API_KEY=project-fixture\n')
                (skill / '.env').write_text('GEMINI_API_KEY=skill-fixture\n')
                self.assertEqual(helper.get_api_key_or_exit(skill), 'project-fixture')

    def test_missing_key_exits_once_with_actionable_paths(self):
        with tempfile.TemporaryDirectory() as directory, patch.dict(os.environ, {}, clear=True):
            for prefix in ['skills', '.agents/skills', '.claude/skills']:
                skill = Path(directory) / prefix / 'example'
                skill.mkdir(parents=True)
                with contextlib.redirect_stderr(io.StringIO()) as error:
                    with self.assertRaises(SystemExit) as raised:
                        helper.get_api_key_or_exit(skill)
                self.assertEqual(raised.exception.code, 1)
                self.assertIn(str(skill / '.env'), error.getvalue())


if __name__ == '__main__':
    unittest.main()
