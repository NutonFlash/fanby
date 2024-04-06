import { GridRenderEditCellParams } from '@mui/x-data-grid';
import {
  useLayoutEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import InputAdornment from '@mui/material/InputAdornment';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';

const MAX_GROUP_COMMENT_LENGTH = 120;

export function validateGroupComment(comment: string) {
  if (comment.length > MAX_GROUP_COMMENT_LENGTH) {
    return `Comment needs to be no more than ${MAX_GROUP_COMMENT_LENGTH} characters. Please enter a shorter one.`;
  }
  return '';
}

interface GroupCommentEditProps extends GridRenderEditCellParams {
  setNewValue: Dispatch<SetStateAction<any>>;
  setHasChanged: Dispatch<SetStateAction<boolean>>;
}

export default function GroupCommentEdit(props: GroupCommentEditProps) {
  const { value, hasFocus, setNewValue, setHasChanged } = props;

  const ref = useRef<HTMLInputElement>();

  const [groupComment, setGroupComment] = useState(value);
  const [error, setError] = useState(validateGroupComment(value));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setGroupComment(newValue);
    setError(validateGroupComment(newValue));

    setNewValue(newValue);
    setHasChanged(true);
  };

  useLayoutEffect(() => {
    if (hasFocus && ref.current) {
      ref.current.focus();
    }
  }, [hasFocus, ref]);

  return (
    <Input
      value={groupComment}
      onChange={handleChange}
      inputRef={ref}
      sx={{
        width: 1,
        '& .MuiInput-input': {
          ml: error ? 1 : 1,
          mr: error ? 0 : 1,
        },
      }}
      inputProps={{
        sx: {
          p: 1,
        },
      }}
      disableUnderline
      endAdornment={
        error ? (
          <Tooltip title={error} placement="right" arrow>
            <InputAdornment position="end" sx={{ mr: 0.75, ml: 0.5 }}>
              <ErrorIcon
                fontSize="small"
                color="error"
                sx={{ cursor: 'pointer' }}
              />
            </InputAdornment>
          </Tooltip>
        ) : null
      }
    />
  );
}
