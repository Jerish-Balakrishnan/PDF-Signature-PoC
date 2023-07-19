import { Component, AfterViewInit } from '@angular/core';
import * as FileSaver from 'file-saver';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
	pdfSrc: string = 'assets/form.pdf';

	ngAfterViewInit() {
		// Wait for the viewer to be fully initialized
		setTimeout(() => this.registerPdfSaveCallback());
	}

	registerPdfSaveCallback() {
		const pdfViewerApplication = (window as any).PDFViewerApplication;

		if (pdfViewerApplication) {
			// Ensure that the viewer is loaded and the APIs are accessible
			if (pdfViewerApplication.pdfDocument) {
				// Do nothing if pdfDocument is already available (typically the case when the PDF is already rendered)
			} else {
				// This listens to an event which indicates that the PDF has been loaded into the viewer
				document.addEventListener('pdfloaded', () => this.registerPdfSaveCallback());
			}
		}
	}

	async savePdf() {
		const pdfViewerApplication = (window as any).PDFViewerApplication;

		if (pdfViewerApplication && pdfViewerApplication.pdfDocument) {
			try {
				const pdfDocument = pdfViewerApplication.pdfDocument;
				// This saves the PDF as an ArrayBuffer
				const pdfData = await pdfDocument.saveDocument(pdfDocument.annotationStorage);

				// Convert the ArrayBuffer to a Blob
				const blob = new Blob([pdfData], { type: 'application/pdf' });

				FileSaver.saveAs(blob, "filled.pdf");

				// update the pdf resource on the pdf frame -- optional
				var blobURL = URL.createObjectURL(blob);
				// this.pdfSrc = blobURL;
				console.log(blobURL);

				// Clean up
				URL.revokeObjectURL(blobURL);
			} catch (error) {
				console.error("Error exporting PDF:", error);
			}
		}
	}
}
