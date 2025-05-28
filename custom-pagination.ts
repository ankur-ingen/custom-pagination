yourTable(){
    this.gridOptions = {
        // other grid options
        paginationPageSize: 10,
        paginationAutoPageSize: false,
        suppressPaginationPanel: true, // Hide default pagination 
        onPaginationChanged: (params: any) => {
            this.setupCustomPagination();
        },
         onGridReady: (params: any) => {
          // other code
          setTimeout(() => this.setupCustomPagination(), 10);
        },
        // other grid options
    }
}

setupCustomPagination(): void {
    if(!this.gridApi) return;

    const totalRows: number = this.gridApi.getDisplayedRowCount();
    const pageSize: number = this.gridApi.paginationGetPageSize();
    const totalPages: number = Math.ceil(totalRows / pageSize);
    const currentPage: number = this.gridApi.paginationGetCurrentPage();

    const pageListContainer = document.getElementById("pageList");
    const totalPagesSpan = document.getElementById("totalPages");
    const firstPageBtn = document.getElementById("firstPage") as HTMLButtonElement;
    const prevPageBtn = document.getElementById("prevPage") as HTMLButtonElement;
    const nextPageBtn = document.getElementById("nextPage") as HTMLButtonElement;
    const lastPageBtn = document.getElementById("lastPage") as HTMLButtonElement;

    if(!pageListContainer || !totalPagesSpan) return;

// Update total pages text
totalPagesSpan.innerText = `Total Pages: ${totalPages}`;
pageListContainer.innerHTML = "";

// First Page Button
firstPageBtn?.addEventListener("click", () => {
    if (currentPage > 0) {
        this.gridApi.paginationGoToPage(0);
    }
});

// Previous Button
prevPageBtn?.addEventListener("click", () => {
    if (currentPage > 0) {
        this.gridApi.paginationGoToPreviousPage();
    }
});

// Next Button
nextPageBtn?.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
        this.gridApi.paginationGoToNextPage();
    }
});

// Last Page Button
lastPageBtn?.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
        this.gridApi.paginationGoToPage(totalPages - 1);
    }
});

// Generate page numbers
const generatePageNumbers = (): void => {
    const startPage = Math.max(0, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement("button");
        pageBtn.innerText = (i + 1).toString();
        pageBtn.className = i === currentPage ? "page-btn active" : "page-btn";
        pageBtn.addEventListener("click", () => {
            this.gridApi.paginationGoToPage(i);
        });
        pageListContainer.appendChild(pageBtn);
    }
};

// Update button states
const updateButtonStates = (): void => {
    if (firstPageBtn) firstPageBtn.disabled = currentPage === 0;
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 0;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages - 1;
    if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages - 1;
};

// Initialize pagination
generatePageNumbers();
updateButtonStates();

// Add event listener for pagination changes
this.gridApi.addEventListener('paginationChanged', () => {
    const newCurrentPage = this.gridApi.paginationGetCurrentPage();
    pageListContainer.innerHTML = "";
    generatePageNumbers();
    updateButtonStates();
});
}
