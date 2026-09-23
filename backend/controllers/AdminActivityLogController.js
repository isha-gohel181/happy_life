import fs from 'fs';
import path from 'path';

/**
 * Save admin activity logs received from the Admin Panel.
 * Expects { logs: Array } in req.body.
 */
export const saveAdminLogs = async (req, res) => {
  try {
    const { logs } = req.body;
    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ success: false, message: 'Invalid payload: logs must be an array.' });
    }

    if (logs.length === 0) {
      return res.status(200).json({ success: true, message: 'No logs to save.' });
    }

    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Daily admin log file: YYYY-MM-DD
    const dateStr = new Date().toISOString().split('T')[0];
    const logFilePath = path.join(logDir, `admin_activity_${dateStr}.log`);

    // Format logs as Newline-Delimited JSON (NDJSON)
    const logLines = logs.map(log => JSON.stringify({
      ...log,
      serverReceivedAt: new Date().toISOString(),
      ip: req.ip || req.headers['x-forwarded-for'] || '',
    })).join('\n') + '\n';

    fs.appendFile(logFilePath, logLines, 'utf8', (err) => {
      if (err) {
        console.error('[AdminActivityLog] Error writing logs to file:', err);
        return res.status(500).json({ success: false, message: 'Failed to write logs to disk.' });
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[AdminActivityLog] Controller error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
