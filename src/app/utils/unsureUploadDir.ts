import fs from 'fs/promises';
import path from 'path';

export const ensureUploadDir = async () => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    try {
        await fs.access(uploadDir);
        // eslint-disable-next-line no-console
        console.log('✓ Uploads directory exists');
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
        // eslint-disable-next-line no-console
        console.log('✓ Uploads directory created');
    }
};