import React from 'react';
import PropTypes from 'prop-types';
import useDownloadFile from '../hooks/useDownloadFile';
import { PaperClipIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';

function DocumentList({ documents, onError }) {

    const [documentsDownloading, download] = useDownloadFile();

    const downloadFile = async(key, bucket, name) => {
        try {
            await download(key, bucket, name);
        } catch (e) {
            if (onError) onError(e);
        }
    }

    return (
        <>
            <ul role="list" className="divide-y divide-gray-200 rounded-md border border-gray-200">
                {documents?.map((document, i) => (
                    <li key={i} className="flex items-center justify-between py-5 md:py-3 pl-3 pr-4 text-sm">
                        <div className="flex w-0 flex-1 items-center">
                            <PaperClipIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                            <span className="md:hidden ml-2 w-0 flex-1 truncate">
                                {document.name || document.key?.split("/")?.pop()}
                            </span>
                            <span className={`${(!document.key || !document.bucket || documentsDownloading?.includes(document.key)) ? 'cursor-default' : 'cursor-pointer'} hidden md:block ml-2 truncate`} onClick={() => { downloadFile(document.key, document.bucket, document.name) }}>
                                {document.name || document.key?.split("/")?.pop()}
                            </span>
                        </div>
                        <div className="md:hidden ml-4 flex-shrink-0 flex gap-2">
                            {documentsDownloading?.includes(document.key) ?
                                <span className="flex items-center">
                                    <svg className="inline w-7 h-7 text-v2-blue-text-login animate-spin fill-white" viewBox="0 0 100 101" fill="current" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                </span>
                                :
                                <ArrowDownTrayIcon
                                    className={`${(!document.key || !document.bucket) ? 'cursor-default text-gray-400' : 'cursor-pointer text-v2-blue-text-login'} w-7 h-7`}
                                    onClick={() => { downloadFile(document.key, document.bucket, document.name) }} />
                            }
                        </div>
                        <div className="hidden md:flex ml-4 flex-shrink-0 gap-2">
                            {documentsDownloading?.includes(document.key) &&
                                <span className="flex items-center">
                                    <svg className="inline w-5 h-5 text-v2-blue-text-login animate-spin fill-white" viewBox="0 0 100 101" fill="current" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                    </svg>
                                </span>
                            }
                            <button className={`${(!document.key || !document.bucket || documentsDownloading?.includes(document.key)) ? 'cursor-default text-gray-400' : 'text-v2-blue-text-login'} transition-all font-medium`}
                                onClick={() => { downloadFile(document.key, document.bucket, document.name) }}>
                                Descargar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

DocumentList.propTypes = {
    documents: PropTypes.array,
    onError: PropTypes.func
}

export default DocumentList;