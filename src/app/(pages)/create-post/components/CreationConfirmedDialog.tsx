"use client";

import { createPost } from "@/usecases/blog/createPost";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  transactionData: Awaited<ReturnType<typeof createPost>>;
};

const CreationConfirmedDialog: React.FC<Props> = ({
  isDialogOpen,
  setIsDialogOpen,
  transactionData: { id, cid, txHash },
}) => {
  const router = useRouter();

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => {
        setIsDialogOpen(false);
        router.push(`/posts`);
      }}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="lg"
    >
      <DialogTitle id="confirmation-dialog-title">Post Created</DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirmation-dialog-description"
          component="div"
          display={"flex"}
          flexDirection={"column"}
        >
          <Typography>Post successfully created with id: </Typography>
          <Typography variant="body1">{id}</Typography>
          <Typography variant="body1" mt={1}>
            CID:
          </Typography>
          <Link
            href={`${process.env.NEXT_PUBLIC_IPFS_GET_URL}/${cid}`}
            target="_blank"
          >
            <Typography variant="body1">{cid}</Typography>
          </Link>
          <Typography variant="body1" mt={1}>
            Transaction Hash:
          </Typography>
          <Link
            href={`${process.env.NEXT_PUBLIC_BLOCKCHAIN_EXPLORER_URL}/tx/${txHash}`}
            target="_blank"
          >
            <Typography variant="body1">{txHash}</Typography>
          </Link>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setIsDialogOpen(false);
            router.push(`/posts`);
          }}
          color="primary"
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreationConfirmedDialog;
