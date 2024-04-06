import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Dispatch, SetStateAction, ChangeEvent, useState } from 'react';

const MAX_GROUP_COMMENT_LENGTH = 120;

function validateGroupComment(comment: string) {
  if (comment.length > MAX_GROUP_COMMENT_LENGTH) {
    return `Comment needs to be mo more than ${MAX_GROUP_COMMENT_LENGTH} characters. Please enter a shorter one.`;
  }
  return '';
}

interface GroupCommentInputProps {
  comment: string;
  setComment: Dispatch<SetStateAction<string>>;
  groupCommentError: string;
  setGroupCommentError: Dispatch<SetStateAction<string>>;
}

export default function GroupCommentInput(props: GroupCommentInputProps) {
  const { comment, setComment, groupCommentError, setGroupCommentError } =
    props;

  const [characterCounter, setCharacterCounter] = useState(0);

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupCommentError(validateGroupComment(event.target.value));
    setComment(event.target.value);
    setCharacterCounter(event.target.value.length);
  };

  return (
    <TextField
      label="Comment (optional)"
      multiline
      minRows={3}
      maxRows={10}
      value={comment}
      onChange={handleCommentChange}
      error={Boolean(groupCommentError)}
      helperText={
        groupCommentError || 'Here you can make some notes about the group.'
      }
      sx={{
        '& .MuiFormHelperText-root': {
          mt: '5px',
          lineHeight: 'normal',
        },
      }}
      InputProps={{
        inputProps: {
          maxLength: MAX_GROUP_COMMENT_LENGTH,
        },
        endAdornment: (
          <InputAdornment
            position="end"
            sx={{
              position: 'absolute',
              bottom: 20,
              right: 15,
            }}
          >
            {`${characterCounter}/${MAX_GROUP_COMMENT_LENGTH}`}
          </InputAdornment>
        ),
      }}
    />
  );
}
