import express from 'express';
import { startOrContinueChat, getChatHistory, getMessages } from '../controllers/aiChatController.js';
import { getAISettings, updateAISettings } from '../controllers/aiSettingsController.js';
import { addKnowledgeBaseItem, listKnowledgeBaseItems, deleteKnowledgeBaseItem, getKnowledgeBaseItem } from '../controllers/knowledgeBaseController.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
import { isAdmin } from '../middlewares/isAdmin.js';
import passport from 'passport';
import accessTokenAutoRefresh from '../middlewares/accessTokenAutoRefresh.js';

const router = express.Router();

router.use(accessTokenAutoRefresh);
router.use(passport.authenticate('jwt', { session: false }));
router.post('/chat', startOrContinueChat);
router.get('/history', getChatHistory);
router.get('/messages/:roomId', getMessages);

// AI Settings
router.get('/settings', getAISettings);
router.put('/settings', isAdmin, updateAISettings);

// Knowledge Base
router.get('/knowledge', listKnowledgeBaseItems);
router.post('/knowledge', isAdmin, upload.array('files'), addKnowledgeBaseItem);
router.get('/knowledge/:id', getKnowledgeBaseItem);
router.delete('/knowledge/:id', isAdmin, deleteKnowledgeBaseItem);

export default router;
