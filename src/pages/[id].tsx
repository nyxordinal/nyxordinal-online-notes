import EditorLayout from '@component/EditorLayout';
import {
  AppBar,
  Button,
  ButtonGroup,
  Container,
  CssBaseline,
  Fab,
  Grid,
  Snackbar,
  Toolbar,
  Typography,
  useScrollTrigger,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { getNote, updateNote } from '@service';
import { convertFromRaw, Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import 'draft-js/dist/Draft.css';
import { useRouter } from 'next/router';
import { cloneElement, Fragment, useEffect, useState } from 'react';

function ElevationScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
    },
    saveButton: {
      margin: '16px auto',
    },
    fab: {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  })
);

export default function NyxordinalEditor() {
  const router = useRouter();
  const classes = useStyles();
  const { id } = router.query;
  const emptyContentState = convertFromRaw({
    entityMap: {},
    blocks: [
      {
        text: '',
        key: 'foo',
        type: 'unstyled',
        entityRanges: [],
        depth: 0,
        inlineStyleRanges: [],
      },
    ],
  });
  const [editorState, setEditorState] = useState(EditorState.createWithContent(emptyContentState));
  const [editMode, setEditMode] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [sycnMessage, setSyncMessage] = useState('Saved');

  useEffect(() => {
    const fetchData = async (noteId: string) => {
      // Fetch data from API
      const r = await getNote(noteId);
      if (r.success) {
        // Create content state from HTML in API Response
        const contentState = stateFromHTML(r.data.content);

        // Set editor state
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        // Open error alert
        showErrorAlert(r.message);
      }
    };
    if (id) {
      fetchData(id as string);
    }
  }, [id]);

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      handleChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const handleChange = (state: EditorState) => {
    setSyncMessage('Unsaved');
    setEditorState(state);
    setEditMode(true);
  };

  const onBoldClick = () => {
    const newState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
    handleChange(newState);
  };

  const onItalicClick = () => {
    const newState = RichUtils.toggleInlineStyle(editorState, 'ITALIC');
    handleChange(newState);
  };

  const handleSubmit = async () => {
    // Send editor content to API
    setSyncMessage('Saving...');
    const blocks = stateToHTML(editorState.getCurrentContent());
    const r = await updateNote({ note_id: id as string, content: blocks });
    if (r.success) {
      // Set sync message to saved
      setSyncMessage('Saved');
      // Set edit mode to false
      setEditMode(false);
    } else {
      // Open error alert
      showErrorAlert(r.message);
    }
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErrorAlert(false);
  };

  const showErrorAlert = (message: string) => {
    setOpenErrorAlert(true);
    setErrorAlertMessage(message);
  };

  return (
    <EditorLayout>
      <Fragment>
        <CssBaseline />
        <ElevationScroll>
          <AppBar>
            <Toolbar>
              <Typography variant="h6" className={classes.title}>
                Nyxordinal Online Editor
              </Typography>
              <ButtonGroup variant="contained" color="secondary" aria-label="outlined primary button group">
                <Button onClick={onBoldClick}>Bold</Button>
                <Button onClick={onItalicClick}>Italic</Button>
              </ButtonGroup>
              <Fab variant="extended" className={classes.fab} disabled aria-label="add">
                <CloudDoneIcon className={classes.extendedIcon} />
                {sycnMessage}
              </Fab>
            </Toolbar>
          </AppBar>
        </ElevationScroll>
        <Toolbar />
        <Snackbar open={openErrorAlert} autoHideDuration={5000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            {errorAlertMessage}
          </Alert>
        </Snackbar>
        <Container maxWidth={false} disableGutters={true}>
          <Editor
            editorKey="editor"
            editorState={editorState}
            onChange={handleChange}
            placeholder="Write your note here ..."
            handleKeyCommand={handleKeyCommand}
          />
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item lg={3} md={5} xs={10}>
              <Button
                size="medium"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
                className={classes.saveButton}
              >
                Save Note
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Fragment>
    </EditorLayout>
  );
}
