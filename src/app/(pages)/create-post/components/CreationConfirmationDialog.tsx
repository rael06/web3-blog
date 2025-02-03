"use client";

import { useWalletContext } from "@/app/contexts/WalletContext";
import { createPost } from "@/usecases/blog/createPost";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CreationConfirmedDialog from "./CreationConfirmedDialog";
import { Warning } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

type Props = {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postData: {
    title: string;
    body: string;
    category: string;
    image: File | null;
  };
};

const CreationConfirmationDialog: React.FC<Props> = ({
  isDialogOpen,
  setIsDialogOpen,
  postData,
}) => {
  const { provider, account } = useWalletContext();
  const [transactionData, setTransactionData] = useState<Awaited<
    ReturnType<typeof createPost>
  > | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isConfirmedDialogOpen, setIsConfirmedDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      if (!provider) {
        throw new Error("Provider not connected");
      }

      const transactionData = await createPost({
        provider,
        postData,
      });

      setTransactionData(transactionData);
      setSubmissionError("");
      setIsDialogOpen(false);
      setIsConfirmedDialogOpen(true);
    } catch (error) {
      console.error(error);
      setSubmissionError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {transactionData && (
        <CreationConfirmedDialog
          isDialogOpen={isConfirmedDialogOpen}
          setIsDialogOpen={setIsConfirmedDialogOpen}
          transactionData={transactionData}
        />
      )}
      <Dialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
        }}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="confirmation-dialog-title">
          <Box display={"flex"} alignItems={"center"}>
            <Warning sx={{ mr: 1 }} />
            Post Creation confirmation
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="confirmation-dialog-description"
            component="div"
            display={"flex"}
            flexDirection={"column"}
          >
            <Typography>
              You are about to create a new post with account:
            </Typography>
            <Typography>{account}</Typography>
            <Typography mt={1}>
              Your post will be accessible publicly.
            </Typography>
            <Typography mt={1}>
              Do not have sensitive information in your post!
            </Typography>
            <Typography>Do not harm yourself or others!</Typography>
            <Typography>You will not be able to revert this action.</Typography>
            <Typography mt={1}>Are you sure you want to continue? </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            variant="contained"
            onClick={() => {
              submit();
            }}
            color="primary"
          >
            Confirm
          </LoadingButton>
        </DialogActions>
        {submissionError && (
          <Alert severity="error" sx={{ mx: 2, mb: 2 }}>
            {submissionError}
          </Alert>
        )}
      </Dialog>
    </>
  );
};

export default CreationConfirmationDialog;
