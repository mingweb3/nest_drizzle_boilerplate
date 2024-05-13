import { get, last, split, toLower } from 'lodash';

export const lookupMimeType = (fileName: string) => {
	const extension = toLower(last(split(fileName, '.')));
	const DEFAULT_MIME_TYPE = 'text/plain';
	const mimeTypes: Record<string, string> = {
		'.txt': 'text/plain',
		'.html': 'text/html',
		'.css': 'text/css',
		'.js': 'application/javascript',
		'.jpg': 'image/jpeg',
		'.png': 'image/png',
		'.pdf': 'application/pdf',
		'.json': 'application/json',
		'.xml': 'application/xml',
		'.svg': 'image/svg+xml',
		'.mp3': 'audio/mpeg',
		'.mp4': 'video/mp4',
		'.doc': 'application/msword',
		'.docx':
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
		'.xls': 'application/vnd.ms-excel',
		'.xlsx':
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	};

	const cleanedExtension = extension.startsWith('.')
		? extension
		: `.${extension}`;
	const mimeType = get(mimeTypes, cleanedExtension, DEFAULT_MIME_TYPE);

	return mimeType;
};
