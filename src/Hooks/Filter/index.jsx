import Chip from '@material-ui/core/Chip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import DoneIcon from '@material-ui/icons/DoneSharp';
import Fade from '@material-ui/core/Fade';
import FilterListIcon from '@material-ui/icons/FilterListSharp';
import Fuse from 'fuse.js';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
} from 'react';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import moment from 'moment';
import FilterInput from './input.jsx';
import FILTER_TYPES from './constants.js';
import useStyles from './styles.js';
import { dateRangeMap, getInitialFilterVal, getChipLabel } from './helpers';

const filterSingleProp = (rows, filter) => {
  const search = filter.value;
  if (search === '' || !search || !filter.isActive) { return undefined; }

  if (search instanceof Array) {
    if (search.length < 1) { return undefined; }
    const setArray = search.map(s => filterSingleProp(rows, {
      ...filter,
      value: s,
    }));
    const filteredSet = new Set();
    setArray.forEach((s) => {
      s.forEach((i) => { filteredSet.add(i); });
    });
    return filteredSet;
  }

  if (filter.type === FILTER_TYPES.DATE) {
    const date = search.value;
    const { range } = search;
    if (!date || date === '' || !range || range === '') { return undefined; }
    const filteredSet = new Set();
    rows.forEach((r) => {
      const [rangeStart, rangeEnd] = dateRangeMap[range](date);
      if (moment(r[filter.key]).isBetween(rangeStart, rangeEnd)) {
        filteredSet.add(r);
      }
    });
    return filteredSet;
  }

  const filterOptions = {
    distance: 100,
    keys: [filter.key],
    location: 0,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    shouldSort: true,
    threshold: 0.4,
  };
  const filterObject = new Fuse(rows, filterOptions);
  return new Set(filterObject.search(search));
};

const useTableFilter = (data, columns, classes, onFilter = () => {}) => {
  const classList = useStyles();
  const buttonRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const handleFilterClick = () => {
    setMenuOpen(prev => !prev);
  };
  const closeMenu = () => setMenuOpen(false);

  const [filters, setFilters] = useState(() => {
    const flts = {};
    columns.forEach((c) => {
      const { filter: fil } = c;
      if (fil === undefined) { return; }
      let displayName;
      if (fil.label) {
        displayName = fil.label;
      } else {
        displayName = c.label ? c.label : c.dataKey;
      }
      flts[c.dataKey] = {
        ...fil,
        chipRender: false,
        displayName,
        isActive: false,
        key: c.dataKey,
        value: getInitialFilterVal(fil),
      };
    });
    return flts;
  });
  // Effect to refresh autocomplete options for the filter
  useEffect(() => {
    setFilters((prev) => {
      const flts = { ...prev };
      Object.keys(flts).forEach((k) => {
        if (flts[k].type !== FILTER_TYPES.TEXT_AUTOCOMPLETE) {
          return;
        }
        const colVals = data.map(rd => rd[k]);
        flts[k].autocompleteOptions = colVals
          .filter((val, i) => colVals.indexOf(val) === i)
          .map(item => ({
            value: item,
            label: item,
          }));
      });
      return flts;
    });
  }, [data]);

  const filteredRows = useMemo(() => {
    let baseResultSet;
    // Loop through all filters. Add to final result only if row matches all filters
    Object.values(filters).forEach((fil) => {
      const thisResultSet = filterSingleProp(data, fil);
      if (baseResultSet === undefined) { baseResultSet = thisResultSet; return; }
      // Intersection of the two sets. Effectively, this acts as an "and" operator on the fields
      if (thisResultSet === undefined) { return; }
      baseResultSet = new Set([...baseResultSet].filter(e => thisResultSet.has(e)));
    });
    if (baseResultSet === undefined) { return data; }

    // Fire onFilter event only if the memoized value changed
    onFilter(filters);
    return [...baseResultSet];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, data]);
  if (Object.entries(filters).length === 0) { return [data, '']; }

  const setFilterValue = key => (val) => {
    // A filter update turns the filter chip active if:
    // - there is a filter value AND
    // - the chip isn't rendered yet and should be OR the chip is already active
    const filterActive = !(val === '' || val.length === 0) && (!filters[key].chipRender || filters[key].isActive);
    const renderChip = !(val === '' || val.length === 0 || (filters[key].type === FILTER_TYPES.DATE && (val.value === '' || val.value === undefined)));

    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        chipRender: renderChip,
        isActive: filterActive,
        value: val,
      },
    }));
  };
  const toggleFilterChip = key => () => {
    setFilters(prev => ({ ...prev, [key]: { ...prev[key], isActive: !prev[key].isActive } }));
  };
  const deleteFilterChip = key => () => {
    setFilters(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        chipRender: false,
        isActive: false,
        value: getInitialFilterVal(prev[key]),
      },
    }));
  };

  const filterElement = (
    <div className={clsx(classList.filter, classes.filter)}>
      <ClickAwayListener onClickAway={closeMenu} mouseEvent="onMouseUp" touchEvent="onTouchEnd">
        <Popper open={menuOpen} anchorEl={buttonRef.current} placement="bottom-end" transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps}>
              <Paper
                className={clsx(classList.filterPopper, classes.filterMenu)}
                elevation={4}
                square
              >
                {Object.values(filters).map(f => (
                  <FilterInput filter={f} key={f.key} setValue={setFilterValue(f.key)} />
                ))}
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
      <IconButton aria-label="filter" className={classes.filterButton} onClick={handleFilterClick} ref={buttonRef}>
        <FilterListIcon fontSize="large" />
      </IconButton>
      {Object.values(filters).every(e => !e.chipRender)
        ? <Typography variant="subtitle1">No active filters</Typography>
        : ''}
      <div className={classList.chipContainer}>
        {Object.values(filters).map(f => (!f.chipRender ? '' : (
          <Chip
            classes={{ root: clsx(classList.chip, classes.filterChip, f.isActive ? classList.chipActive : '') }}
            clickable
            deletable="true"
            icon={f.isActive ? <DoneIcon fontSize="small" /> : <span />}
            key={f.key}
            label={getChipLabel(f)}
            onClick={toggleFilterChip(f.key)}
            onDelete={deleteFilterChip(f.key)}
          />
        )))}
      </div>
    </div>
  );
  return [filteredRows, filterElement];
};

export default useTableFilter;