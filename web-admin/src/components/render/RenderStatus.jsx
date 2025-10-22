import { Badge } from "@/components/ui/Badge";

export const renderStatus = (status) => {
  switch (status) {
    case "submitted":
      return <Badge variant="warning">Submitted</Badge>;
    case "approved_manager":
      return <Badge variant="success">Approved_Manager</Badge>;
    case "rejected_manager":
      return <Badge variant="destructive">Rejected_Manager</Badge>;
    case "partially_approved":
      return <Badge variant="secondary">Partially_Approved</Badge>;
    case "canceled":
      return <Badge variant="destructive">Canceled</Badge>;
    case "closed":
      return <Badge variant="secondary">Closed</Badge>;
    default:
      return <Badge variant="default">Unknown</Badge>;
  }
};

export const renderStatusItem = (status) => {
  switch (status) {
    case "approved":
      return <Badge variant="success">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "canceled":
      return <Badge variant="destructive">Canceled</Badge>;
    case "paid":
      return <Badge variant="success">Paid</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};
