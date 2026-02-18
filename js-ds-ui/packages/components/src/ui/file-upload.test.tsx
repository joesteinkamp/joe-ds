import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { FileUpload } from './file-upload';

// Helper to create a mock File with a specified size
function createMockFile(
  name: string,
  sizeInBytes: number,
  type: string = 'image/png'
): File {
  const file = new File(['x'.repeat(Math.min(sizeInBytes, 100))], name, { type });
  Object.defineProperty(file, 'size', { value: sizeInBytes, configurable: true });
  return file;
}

// Helper to create a FileList-like object from an array of Files
function createFileList(files: File[]): FileList {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      for (const file of files) yield file;
    },
  } as unknown as FileList;

  files.forEach((file, index) => {
    Object.defineProperty(fileList, index, { value: file, configurable: true });
  });

  return fileList;
}

describe('FileUpload', () => {
  // Mock URL.createObjectURL and URL.revokeObjectURL
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  describe('Rendering', () => {
    it('renders drop zone with upload text', () => {
      render(<FileUpload />);
      expect(
        screen.getByText('Click to upload or drag and drop')
      ).toBeInTheDocument();
    });

    it('renders the drop zone as a clickable area with role="button"', () => {
      render(<FileUpload />);
      const dropZone = screen.getByRole('button');
      expect(dropZone).toBeInTheDocument();
    });

    it('renders the hidden file input', () => {
      render(<FileUpload />);
      const fileInput = screen.getByLabelText('File upload');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('type', 'file');
    });

    it('does not render file list initially', () => {
      render(<FileUpload />);
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it('renders the upload icon', () => {
      const { container } = render(<FileUpload />);
      const svg = container.querySelector('svg[aria-hidden]');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Description', () => {
    it('renders description text when provided', () => {
      render(<FileUpload description="PNG, JPG up to 5MB" />);
      expect(screen.getByText('PNG, JPG up to 5MB')).toBeInTheDocument();
    });

    it('does not render description when not provided', () => {
      render(<FileUpload />);
      // Only the upload text should be present, no description
      const texts = screen.getAllByText(/./);
      const descriptionEl = texts.find(
        (el) =>
          el.classList.contains('text-[var(--font-size-xs)]') &&
          el.classList.contains('mt-1')
      );
      expect(descriptionEl).toBeUndefined();
    });
  });

  describe('Disabled state', () => {
    it('disables the file input when disabled=true', () => {
      render(<FileUpload disabled />);
      const fileInput = screen.getByLabelText('File upload');
      expect(fileInput).toBeDisabled();
    });

    it('sets tabIndex to -1 on drop zone when disabled', () => {
      render(<FileUpload disabled />);
      const dropZone = screen.getByRole('button');
      expect(dropZone).toHaveAttribute('tabindex', '-1');
    });

    it('sets tabIndex to 0 on drop zone when not disabled', () => {
      render(<FileUpload />);
      const dropZone = screen.getByRole('button');
      expect(dropZone).toHaveAttribute('tabindex', '0');
    });
  });

  describe('File selection via input', () => {
    it('calls onFilesChange when files are selected via input', () => {
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('test.png', 1024);
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(onFilesChange).toHaveBeenCalledTimes(1);
      expect(onFilesChange).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            file: file,
            id: expect.any(String),
          }),
        ])
      );
    });

    it('renders file list after file selection', () => {
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('document.pdf', 2048, 'application/pdf');
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getByText('document.pdf')).toBeInTheDocument();
    });

    it('displays formatted file size', () => {
      render(<FileUpload />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('photo.jpg', 1024);
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(screen.getByText('1.0 KB')).toBeInTheDocument();
    });

    it('displays file size in MB for large files', () => {
      render(<FileUpload />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('video.mp4', 2.5 * 1024 * 1024, 'video/mp4');
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(screen.getByText('2.5 MB')).toBeInTheDocument();
    });

    it('displays file size in bytes for very small files', () => {
      render(<FileUpload />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('tiny.txt', 500, 'text/plain');
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(screen.getByText('500 B')).toBeInTheDocument();
    });

    it('only keeps one file when multiple=false (default)', () => {
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} />);

      const fileInput = screen.getByLabelText('File upload');
      const file1 = createMockFile('file1.png', 1024);
      const file2 = createMockFile('file2.png', 2048);
      const fileList = createFileList([file1, file2]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      // In non-multiple mode, only the first file should be kept
      const calledWith = onFilesChange.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
    });

    it('accepts multiple files when multiple=true', () => {
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} multiple />);

      const fileInput = screen.getByLabelText('File upload');
      const file1 = createMockFile('file1.png', 1024);
      const file2 = createMockFile('file2.png', 2048);
      const fileList = createFileList([file1, file2]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      const calledWith = onFilesChange.mock.calls[0][0];
      expect(calledWith).toHaveLength(2);
    });

    it('passes accept prop to file input', () => {
      render(<FileUpload accept="image/*,.pdf" />);
      const fileInput = screen.getByLabelText('File upload');
      expect(fileInput).toHaveAttribute('accept', 'image/*,.pdf');
    });

    it('passes multiple prop to file input', () => {
      render(<FileUpload multiple />);
      const fileInput = screen.getByLabelText('File upload');
      expect(fileInput).toHaveAttribute('multiple');
    });
  });

  describe('File size validation', () => {
    it('shows error for files exceeding maxSize', () => {
      const onFilesChange = vi.fn();
      render(
        <FileUpload
          onFilesChange={onFilesChange}
          maxSize={1024} // 1 KB limit
        />
      );

      const fileInput = screen.getByLabelText('File upload');
      const largeFile = createMockFile('big.png', 2048); // 2 KB -- over limit
      const fileList = createFileList([largeFile]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      // Should show an error message
      const errorEl = screen.getByRole('alert');
      expect(errorEl).toBeInTheDocument();
      expect(errorEl.textContent).toContain('big.png');
      expect(errorEl.textContent).toContain('1.0 KB');
    });

    it('does not show error for files within maxSize', () => {
      render(<FileUpload maxSize={2048} />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('ok.png', 1024);
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('filters out oversized files but keeps valid ones', () => {
      const onFilesChange = vi.fn();
      render(
        <FileUpload
          onFilesChange={onFilesChange}
          maxSize={1500}
          multiple
        />
      );

      const fileInput = screen.getByLabelText('File upload');
      const smallFile = createMockFile('small.png', 1024);
      const bigFile = createMockFile('big.png', 2048);
      const fileList = createFileList([smallFile, bigFile]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      // Only the small file should be included
      const calledWith = onFilesChange.mock.calls[0][0];
      expect(calledWith).toHaveLength(1);
      expect(calledWith[0].file.name).toBe('small.png');

      // Error for the big file
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('maxFiles limit', () => {
    it('limits the number of files to maxFiles', () => {
      const onFilesChange = vi.fn();
      render(
        <FileUpload
          onFilesChange={onFilesChange}
          multiple
          maxFiles={2}
        />
      );

      const fileInput = screen.getByLabelText('File upload');
      const file1 = createMockFile('file1.png', 100);
      const file2 = createMockFile('file2.png', 100);
      const file3 = createMockFile('file3.png', 100);
      const fileList = createFileList([file1, file2, file3]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      const calledWith = onFilesChange.mock.calls[0][0];
      expect(calledWith).toHaveLength(2);
    });
  });

  describe('File removal', () => {
    it('removes file when remove button is clicked', () => {
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} />);

      // Add a file first
      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('removable.png', 1024);
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });
      expect(screen.getByText('removable.png')).toBeInTheDocument();

      // Click the remove button
      const removeButton = screen.getByLabelText('Remove removable.png');
      fireEvent.click(removeButton);

      // File should be removed
      expect(screen.queryByText('removable.png')).not.toBeInTheDocument();
      // onFilesChange should have been called with empty array
      const lastCall = onFilesChange.mock.calls[onFilesChange.mock.calls.length - 1][0];
      expect(lastCall).toHaveLength(0);
    });

    it('removes only the targeted file from multiple files', () => {
      const onFilesChange = vi.fn();
      render(<FileUpload onFilesChange={onFilesChange} multiple />);

      const fileInput = screen.getByLabelText('File upload');
      const file1 = createMockFile('keep.png', 1024);
      const file2 = createMockFile('remove.png', 2048);
      const fileList = createFileList([file1, file2]);

      fireEvent.change(fileInput, { target: { files: fileList } });
      expect(screen.getByText('keep.png')).toBeInTheDocument();
      expect(screen.getByText('remove.png')).toBeInTheDocument();

      // Remove the second file
      const removeButton = screen.getByLabelText('Remove remove.png');
      fireEvent.click(removeButton);

      expect(screen.getByText('keep.png')).toBeInTheDocument();
      expect(screen.queryByText('remove.png')).not.toBeInTheDocument();
    });

    it('calls URL.revokeObjectURL when removing an image file', () => {
      render(<FileUpload />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('photo.png', 1024, 'image/png');
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      const removeButton = screen.getByLabelText('Remove photo.png');
      fireEvent.click(removeButton);

      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('className', () => {
    it('applies className to the container div', () => {
      const { container } = render(
        <FileUpload className="my-file-upload" />
      );
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('my-file-upload');
    });
  });

  describe('Ref forwarding', () => {
    it('forwards ref to the container div', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<FileUpload ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.tagName).toBe('DIV');
    });
  });

  describe('Keyboard accessibility', () => {
    it('drop zone has role="button"', () => {
      render(<FileUpload />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('drop zone has tabIndex=0 when enabled', () => {
      render(<FileUpload />);
      const dropZone = screen.getByRole('button');
      expect(dropZone).toHaveAttribute('tabindex', '0');
    });

    it('drop zone has tabIndex=-1 when disabled', () => {
      render(<FileUpload disabled />);
      const dropZone = screen.getByRole('button');
      expect(dropZone).toHaveAttribute('tabindex', '-1');
    });

    it('opens file dialog on Enter key press', () => {
      render(<FileUpload />);
      const fileInput = screen.getByLabelText('File upload');
      const clickSpy = vi.spyOn(fileInput, 'click');

      const dropZone = screen.getByRole('button');
      fireEvent.keyDown(dropZone, { key: 'Enter' });

      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });

    it('opens file dialog on Space key press', () => {
      render(<FileUpload />);
      const fileInput = screen.getByLabelText('File upload');
      const clickSpy = vi.spyOn(fileInput, 'click');

      const dropZone = screen.getByRole('button');
      fireEvent.keyDown(dropZone, { key: ' ' });

      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });

  describe('Drag and drop', () => {
    it('shows "Drop files here" text when dragging over', () => {
      render(<FileUpload />);
      const dropZone = screen.getByRole('button');

      fireEvent.dragOver(dropZone, { dataTransfer: { files: [] } });

      expect(screen.getByText('Drop files here')).toBeInTheDocument();
    });

    it('reverts text after drag leave', () => {
      render(<FileUpload />);
      const dropZone = screen.getByRole('button');

      fireEvent.dragOver(dropZone, { dataTransfer: { files: [] } });
      expect(screen.getByText('Drop files here')).toBeInTheDocument();

      fireEvent.dragLeave(dropZone);
      expect(
        screen.getByText('Click to upload or drag and drop')
      ).toBeInTheDocument();
    });
  });

  describe('Image preview', () => {
    it('creates preview URL for image files', () => {
      render(<FileUpload />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('photo.png', 1024, 'image/png');
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    });

    it('does not create preview URL for non-image files', () => {
      vi.mocked(global.URL.createObjectURL).mockClear();
      render(<FileUpload />);

      const fileInput = screen.getByLabelText('File upload');
      const file = createMockFile('doc.pdf', 1024, 'application/pdf');
      const fileList = createFileList([file]);

      fireEvent.change(fileInput, { target: { files: fileList } });

      expect(global.URL.createObjectURL).not.toHaveBeenCalled();
    });
  });
});
