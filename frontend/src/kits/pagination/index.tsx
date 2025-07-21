import { IcChevronLeft, IcChevronRight } from "@feature/kits/common/icons";
import { Button } from "@kit/button";
import { SvgIcon } from "@kit/svg-icon";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageButtons = () => {
    const buttons = [];

    // If the total number of pages is less than or equal to 5, display all pages
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            color="primary"
            size="small"
            className="m-1 w-[30px]"
            onClick={() => onPageChange(i)}
            variant={currentPage === i ? "solid" : "outline"}
          >
            {i}
          </Button>,
        );
      }
      return buttons;
    }

    // First page button
    buttons.push(
      <Button
        key={1}
        color="primary"
        size="small"
        className="m-1 w-[30px]"
        onClick={() => onPageChange(1)}
        variant={currentPage === 1 ? "solid" : "outline"}
      >
        1
      </Button>,
    );

    // Add "..." if the current page is greater than 4
    if (currentPage > 4) {
      buttons.push(
        <span key="start-ellipsis" className="text-gray-500 m-1 w-[40px]">
          ...
        </span>,
      );
    }

    // Middle page buttons
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      buttons.push(
        <Button
          key={i}
          color="primary"
          size="small"
          className="m-1 w-[30px]"
          onClick={() => onPageChange(i)}
          variant={currentPage === i ? "solid" : "outline"}
        >
          {i}
        </Button>,
      );
    }

    // Add "..." if the current page is less than totalPages - 3
    if (currentPage < totalPages - 3) {
      buttons.push(
        <span key="end-ellipsis" className="text-gray-500 m-1 w-[40px]">
          ...
        </span>,
      );
    }

    // Last page button
    if (totalPages > 1) {
      buttons.push(
        <Button
          key={totalPages}
          color="primary"
          size="small"
          className="m-1 w-[30px]"
          onClick={() => onPageChange(totalPages)}
          variant={currentPage === totalPages ? "solid" : "outline"}
        >
          {totalPages}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <div className="flex flex-wrap justify-center px-2">
      {/* Previous button */}
      {currentPage > 1 && (
        <Button
          color="primary"
          size="small"
          className="m-1 h-[30px] w-[30px]"
          onClick={() => onPageChange(currentPage - 1)}
          variant="outline"
        >
          <SvgIcon
            fillColor={"primary"}
            className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
          >
            <IcChevronRight />
          </SvgIcon>
        </Button>
      )}

      {/* Page buttons */}
      {renderPageButtons()}

      {/* Next button */}
      {currentPage < totalPages && (
        <Button
          color="primary"
          size="small"
          className="m-1 h-[30px] w-[30px]"
          onClick={() => onPageChange(currentPage + 1)}
          variant="outline"
        >
          <SvgIcon
            fillColor={"primary"}
            className={"[&_svg]:h-[14px] [&_svg]:w-[14px]"}
          >
            <IcChevronLeft />
          </SvgIcon>
        </Button>
      )}
    </div>
  );
};

export default Pagination;
