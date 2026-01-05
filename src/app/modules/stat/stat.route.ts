import express from 'express';
import { StatController } from './stat.controller';

const router = express.Router();

router.get('/', StatController.getStats);

export const StatRoutes = router;
