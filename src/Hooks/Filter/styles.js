import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  filter: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.grey}`,
    borderTop: `1px solid ${theme.palette.grey}`,
    display: 'flex',
    height: theme.spacing(6.4),
    padding: `0 ${theme.spacing(1.6)} 0 ${theme.spacing(0.8)}`,
  },
  filterPopper: {
    padding: theme.spacing(3.2),
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(1.6),
    paddingRight: theme.spacing(1.6),
  },
  chip: {
    marginRight: theme.spacing(0.8),
  },
  chipActive: {
    backgroundColor: theme.palette.secondary.light,
    '&:focus, &:active': {
      backgroundColor: `${theme.palette.secondary.light} !important`,
    },
    '&:hover': {
      backgroundColor: `${theme.palette.secondary.main} !important`,
    },
  },
  filterInput: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1.6),
  },
  filterInputText: {
    flex: 1,
    fontSize: theme.spacing(theme.typography.caption.fontSize),
    paddingRight: theme.spacing(1.6),
    paddingTop: theme.spacing(0.5),
  },
  filterInputField: {
    flex: 3,
  },
}));

export default useStyles;