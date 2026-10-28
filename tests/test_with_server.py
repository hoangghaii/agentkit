"""Exercise owned process-tree cleanup and noisy-server output without sockets."""
import importlib.util
import os
from pathlib import Path
import shlex
import sys
import tempfile
import time
import unittest
from unittest.mock import Mock, patch

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('with_server', ROOT / 'skills/webapp-testing/scripts/with_server.py')
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)


class ServerLifecycleTests(unittest.TestCase):
    def test_dead_launcher_cannot_be_reported_ready(self):
        process = Mock()
        process.poll.return_value = 1
        with patch.object(helper, 'is_port_open', return_value=True) as ready:
            self.assertFalse(helper.is_server_ready(8765, process=process))
        ready.assert_not_called()

    def test_occupied_port_is_rejected_before_spawning(self):
        arguments = ['with_server.py', '--server', 'example', '--port', '8765', '--', 'example-test']
        with patch.object(sys, 'argv', arguments), patch.object(helper, 'is_port_open', return_value=True), \
                patch.object(helper, 'start_server') as start:
            with self.assertRaises(SystemExit) as raised:
                helper.main()
        self.assertEqual(raised.exception.code, 2)
        start.assert_not_called()

    @unittest.skipIf(os.name == 'nt', 'POSIX process-group regression; Windows uses taskkill /T')
    def test_noisy_background_child_cannot_survive_cleanup(self):
        with tempfile.TemporaryDirectory() as directory:
            marker = Path(directory) / 'heartbeat'
            child = Path(directory) / 'child.py'
            child.write_text("import signal,time,pathlib\nsignal.signal(signal.SIGTERM,signal.SIG_IGN)\n"
                             "print('x'*262144,flush=True)\n"
                             f"p=pathlib.Path({str(marker)!r})\n"
                             "i=0\nwhile True:\n i+=1\n p.write_text(str(i))\n time.sleep(0.02)\n")
            command = shlex.join([sys.executable, str(child)]) + ' & wait'
            process, output = helper.start_server(command)
            try:
                deadline = time.monotonic() + 5
                while not marker.exists() and time.monotonic() < deadline:
                    time.sleep(0.02)
                self.assertTrue(marker.exists(), 'noisy child never reached readiness')
                self.assertIsNone(process.stdout, 'output must not be an unread pipe')
            finally:
                helper.stop_server(process)
                output.close()
            before = marker.read_text()
            time.sleep(0.15)
            self.assertEqual(marker.read_text(), before, 'background child is still running')


if __name__ == '__main__':
    unittest.main()
