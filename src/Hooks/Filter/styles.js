import { makeStyles } from '@material-ui/core/styles';
import { normSp } from '../../Table/helpers.js';

const useStyles = makeStyles(theme => ({
  filter: {
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.grey.A100}`,
    borderTop: `1px solid ${theme.palette.grey.A100}`,
    display: 'flex',
    height: normSp(theme, 6.4),
    padding: `0 ${normSp(theme, 1.6)} 0 ${normSp(theme, 0.8)}`,
  },
  filterPopper: {
    padding: normSp(theme, 3.2),
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingLeft: normSp(theme, 1.6),
    paddingRight: normSp(theme, 1.6),
  },
  chip: {
    marginRight: normSp(theme, 0.8),
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
    marginBottom: normSp(theme, 1.6),
  },
  filterInputText: {
    flex: 1,
    fontSize: normSp(theme, theme.typography.caption.fontSize),
    paddingRight: normSp(theme, 1.6),
    paddingTop: normSp(theme, 0.5),
  },
  filterInputField: {
    flex: 3,
  },
}));

export default useStyles;