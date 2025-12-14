import { Check, LoaderCircle, Send, Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

type DocumentSubStep = `upload` | `evaluation` | `servicePlan`;

export const SupportingDocuments: React.FC = () => {
  const [ selectedFiles, setSelectedFiles ] = useState<File[]>([]);
  const [ error, setError ] = useState<string | null>(null);
  const [ dragActive, setDragActive ] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ documentStep, setDocumentStep ] = useState<DocumentSubStep>(`upload`);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (!e.target.files) {
      return;
    }
    const files = Array.from(e.target.files);
    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds the 10MB size limit.`);
      return;
    }
    setSelectedFiles((prev) =>
      [
        ...prev,
        ...files.filter(
          (newFile) => !prev.some(
            (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size,
          ),
        ),
      ]);
  };

  const handlePrint = (file: File) => {
    const fileURL = URL.createObjectURL(file);
    const win = window.open(fileURL, `_blank`);
    if (win) {
      win.focus();
      win.print();
    }
    setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
      if (oversized) {
        setError(`File "${oversized.name}" exceeds the 10MB size limit.`);
        return;
      }
      setSelectedFiles((prev) =>
        [
          ...prev,
          ...files.filter(
            (newFile) => !prev.some(
              (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size,
            ),
          ),
        ]);
      if (fileInputRef.current) {
        fileInputRef.current.value = ``;
      }
    }
  };

  return <div>
    <Card className="border-black-300 mx-auto my-[20px] max-w-[1500px] space-y-4 rounded-lg p-[20px] text-center shadow-[0_0_20px_rgba(0,0,0,0.1)]">
      <div className="progressRepresentation flex items-center justify-center space-x-0">
        <div className="mr-4 flex flex-col items-center">
          <Send size={28} className="mb-1 text-green-600" />
          <span className="text-xs font-semibold text-green-600">Form Submitted</span>
        </div>
        <div
          className={cn(`mx-2 mr-4 h-1 w-12 rounded`, {
            'bg-gray-300': documentStep === `upload`,
            'bg-green-400': documentStep !== `upload`,
          })}
        />
        <div className="mr-4 flex flex-col items-center">
          <Upload
            size={28}
            className={`mb-1 ${
              documentStep === `evaluation` || documentStep === `servicePlan` ?
                `text-green-600` :
                `text-gray-400`
            }`}
          />
          <span
            className={`text-xs font-semibold ${
              documentStep === `evaluation` || documentStep === `servicePlan` ?
                `text-green-600` :
                `text-gray-400`
            }`}
          >
            Upload Signed Documents
          </span>
        </div>
        <div
          className={`mx-2 mr-4 h-1 w-12 rounded border-b-2 ${
            documentStep === `servicePlan` ?
              `border-green-400` :
              `border-dotted border-gray-400`
          }`}
        />
        <div className="mr-4 flex flex-col items-center">
          <LoaderCircle
            size={28}
            className={`mb-1 ${documentStep === `servicePlan` ? `text-green-600` : `text-gray-400`}`}
          />
          <span
            className={`text-xs font-semibold ${
              documentStep === `servicePlan` ? `text-green-600` : `text-gray-400`
            }`}
          >
            Evaluation
          </span>
        </div>
        <div className="mx-2 mr-4 h-1 w-12 rounded border-b-2 border-dotted border-gray-400" />
        <div className="flex flex-col items-center">
          <Check
            size={28}
            className={`mb-1 ${documentStep === `servicePlan` ? `text-green-600` : `text-gray-400`}`}
          />
          <span
            className={`text-xs font-semibold ${
              documentStep === `servicePlan` ? `text-green-600` : `text-gray-400`
            }`}
          >
            Service Plan
          </span>
        </div>
      </div>

      {documentStep === `upload` &&
        <div>
          <div>
            <h2 className="mb-5 text-center text-lg">
              Please upload any signed documents and supporting files.
            </h2>
          </div>

          <div
            className={
              [
                `dragDropBox mx-auto mb-4 flex w-full max-w-[600px] h-full flex-col items-center justify-center`,
                `rounded-lg border-2 border-dotted py-8 transition-colors duration-200`,
                dragActive ?
                  `border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950` :
                  `border-border bg-muted dark:border-border dark:bg-muted`,
              ].join(` `)
            }
            role="button"
            tabIndex={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === `Enter` || e.key === ` `) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            style={{ cursor: `pointer` }}
            aria-label="File upload area. Click or press Enter/Space to browse files."
          >
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-muted-foreground">
              Drag &amp; drop files here, or
              {` `}
              <span className="text-blue-600 underline dark:text-blue-400">browse</span>
            </span>
            <span className="mt-2 block text-xs text-muted-foreground">Max file size: 10MB</span>
          </div>

          {error && <div className="mb-2 text-red-600">{error}</div>}

          <div className="mb-4">
            <h3 className="mb-2 font-semibold">Selected Files:</h3>
            {selectedFiles.length > 0 ?
              <ul className="mb-2">
                {selectedFiles.map((file, idx) =>
                  <li key={idx} className="flex items-center justify-center space-x-2">
                    <span>{file.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 rounded-lg border-2 border-slate-400 bg-slate-50 px-3 py-1 text-xs text-slate-700 shadow-lg hover:bg-slate-100 dark:border-slate-500 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      onClick={() => handlePrint(file)}
                    >
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2 rounded-lg border-2 border-red-500 bg-red-50 px-3 py-1 text-xs text-red-700 shadow-lg hover:bg-red-100 dark:border-red-400 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                      onClick={() => {
                        setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
                      }}
                    >
                      Delete
                    </Button>
                  </li>)}
              </ul> :
              <span className="mb-2 block text-gray-400">No files selected</span>}
            <Button
              variant="outline"
              type="submit"
              className="mt-4 w-2/10 rounded-xl border-2 border-blue-500 bg-blue-50 px-8 py-4 py-6 text-blue-700 shadow-lg hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
              onClick={() => {
                if (selectedFiles.length === 0) {
                  setError(`Please select at least one file to upload.`);
                  return;
                }
                // TODO: Implement upload logic here (e.g., send to server)
                alert(`Files submitted successfully!`);
                setSelectedFiles([]);
                if (fileInputRef.current) {
                  fileInputRef.current.value = ``;
                }
                setDocumentStep(`evaluation`);
              }}
            >
              <Send size={25} className="mr-2 inline" />
              Submit Documents
            </Button>
          </div>
        </div>}

      {documentStep === `evaluation` &&
        <div>
          <h2 className="mb-5 text-lg font-semibold">Your submission is being evaluated. Please come back later.</h2>
          <div
            className="mx-auto my-[20px] mt-4 max-w-[800px] rounded-xl border-blue-300 bg-blue-100 p-[20px] shadow-[0_0_20px_rgba(0,0,0,0.1)]"
          >
            <p className="text-gray-600">
              Dena Raines, Hearing Department Administrative Assistant
              {` `}
              <br />
              <a href="mailto:dena.daltonraines@mcesc.org">dena.daltonraines@mcesc.org</a>
              <br />
              <br />
              For additional information, questions or concerns, please reach out to:
              <br />
              Susan Gunnel, Regional Center Director
              {` `}
              <br />
              <a href="mailto:susan.gunnel@mcesc.org">susan.gunnel@mcesc.org</a>
              <br />
              Phone: (937) 236-9965 | Fax: (937) 233-0161
              <br />
              <br />
              Montgomery County ESC Regional Center
              <br />
              4801 Springfield Street | Dayton, OH 45431
            </p>
          </div>
        </div>}

      {documentStep === `servicePlan` &&
        <div>
          <h2 className="mb-5 text-lg font-semibold">Service Plan</h2>
        </div>}
    </Card>
  </div>;
};
