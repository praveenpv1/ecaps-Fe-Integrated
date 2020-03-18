import * as moment from "moment";

export enum STATUS {
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "approved",
  DISAPPROVED = "disapproved",
  INTERNALLY_APPROVED = "internally_approved",
  CASH_REIMBURSEMENT = "cash_reimbursement",
  REJECT = "company_disapproved",
  PENDING_KIT_SYNC = "pending_kit_sync",
  COMPANY_APPROVED = "company_approved"
}

export enum STATUS_TEXT {
  PENDING_APPROVAL = "Pending for approval",
  APPROVED = "Approved",
  DISAPPROVED = "Disapproved",
  INTERNALLY_APPROVED = "Internally Approved",
  CASH_REIMBURSEMENT = "Cash reimbursement",
  REJECT = "Rejected",
  PENDING_KIT_SYNC = "Pending",
  COMPANY_APPROVED = "Approved"
}

export enum DisplayGrid {
  Always = "always",
  OnDragAndResize = "onDrag&Resize",
  None = "none"
}

export const SalaryIn = () => {
  let today: Date;
  let lastDayOfMonth: Date;
  today = new Date();
  lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return (
    ((lastDayOfMonth.getTime() - today.getTime()) / (1000 * 3600 * 24)).toFixed(
      0
    ) + " Days"
  );
};

export const isAdmin = roles => {
  if (roles && roles.includes("admin")) {
    return true;
  } else {
    return false;
  }
};

export const getStatusText = (status: string = "") => {
  switch (status) {
    case STATUS.APPROVED:
      return STATUS_TEXT.APPROVED;
      break;

    case STATUS.PENDING_APPROVAL:
      return STATUS_TEXT.PENDING_APPROVAL;
      break;

    case STATUS.DISAPPROVED:
      return STATUS_TEXT.DISAPPROVED;
      break;

    case STATUS.INTERNALLY_APPROVED:
      return STATUS_TEXT.INTERNALLY_APPROVED;
      break;
    case STATUS.CASH_REIMBURSEMENT:
      return STATUS_TEXT.CASH_REIMBURSEMENT;
      break;

    case STATUS.REJECT:
      return STATUS_TEXT.REJECT;
      break;

    case STATUS.PENDING_KIT_SYNC:
      return STATUS_TEXT.PENDING_KIT_SYNC;
      break;

    case STATUS.COMPANY_APPROVED:
      return STATUS_TEXT.COMPANY_APPROVED;
      break;

    default:
      return status;
      break;
  }
};

export interface PastMonths {
  text: string;
  value: string;
}

export const spendPastMonthList = (pastMonth: number = 6) => {
  return new Array(pastMonth).fill(0).map((_, i) => {
    const month = moment().subtract(i, "months");
    return { text: month.format("MMM YYYY"), value: month.format("MM YYYY") };
  });
};

export const monthNumberList: string[] = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
];

export const futureYearsList = (futureYears: number = 5) =>
  new Array(futureYears).fill(0).map((_, i) => {
    let currentYear = new Date().getFullYear();
    return currentYear + i;
  });

const baseCategoryIconUrl: string = "assets/images/spend-icons";
export const getSpendsSvgIconPath = (type: string) => {
  type = ["Dining", "Transport", "Shopping"].includes(type) ? type : "other";
  return `${baseCategoryIconUrl}/${type
    .replace(/\s/g, "")
    .toLocaleLowerCase()}.svg`;
};

interface Weeks {
  text: string;
  weekNumber: number;
  styleClass: string;
}

export const weeks: Weeks[] = [
  {
    text: "Week 1",
    weekNumber: 1,
    styleClass: "week-selected"
  },
  {
    text: "Week 2",
    weekNumber: 2,
    styleClass: "week-not-selected"
  },
  {
    text: "Week 3",
    weekNumber: 3,
    styleClass: "week-not-selected"
  },
  {
    text: "Week 4",
    weekNumber: 4,
    styleClass: "week-not-selected"
  }
];
