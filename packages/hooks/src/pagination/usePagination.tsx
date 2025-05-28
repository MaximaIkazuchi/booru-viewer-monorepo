import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/shadcn-ui";
import React from "react";
import { PaginationState } from "../query";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingsCount?: number;
};

export const usePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingsCount = 1,
}: PaginationProps) => {
  // Generate page numbers to show on the UI
  const generatePaginationItems = React.useCallback(() => {
    const firstPage = 1;
    const lastPage = totalPages;

    const leftSiblingsIndex = Math.max(currentPage - siblingsCount, firstPage);
    const rightSiblingsIndex = Math.min(currentPage + siblingsCount, lastPage);

    const showLeftDots = leftSiblingsIndex > firstPage + 1;
    const showRightDots = rightSiblingsIndex < lastPage - 1;

    // This will be showed on the UI
    const pageNumbers: (number | "dots")[] = [];

    pageNumbers.push(firstPage);

    if (showLeftDots) {
      pageNumbers.push("dots");
    }

    for (let i = leftSiblingsIndex; i <= rightSiblingsIndex; i++) {
      if (i !== firstPage && i !== lastPage) {
        pageNumbers.push(i);
      }
    }

    if (showRightDots) {
      pageNumbers.push("dots");
    }

    if (lastPage > firstPage) {
      pageNumbers.push(lastPage);
    }

    return pageNumbers;
  }, [currentPage, totalPages, siblingsCount]);

  const paginationItems = generatePaginationItems();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const PaginationComponent = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {paginationItems.map((page, index) => {
          if (page === "dots") {
            return (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return {
    PaginationComponent,
    currentPage,
    totalPages,
    handlePrevious,
    handleNext,
    setPage: onPageChange,
  };
};

export const createPaginationFromState = (
  paginationState: PaginationState,
  totalPages: number,
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
) => {
  return usePagination({
    currentPage: paginationState.currentPage,
    totalPages,
    onPageChange: (page) => {
      setPagination((prev) => ({ ...prev, page }));
    },
  });
};
