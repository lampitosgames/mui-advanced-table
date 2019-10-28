import moment from 'moment';
import FILTER_TYPES from './constants';

export const dateRangeMap = {
  '1 Day': d => [moment(d).subtract(1, 'days'), moment(d).add(1, 'days')],
  '3 Days': d => [moment(d).subtract(4, 'days'), moment(d).add(4, 'days')],
  '1 Week': d => [moment(d).subtract(1, 'weeks'), moment(d).add(1, 'weeks')],
  '2 Weeks': d => [moment(d).subtract(2, 'weeks'), moment(d).add(2, 'weeks')],
  '1 Month': d => [moment(d).subtract(1, 'months'), moment(d).add(1, 'months')],
  '2 Months': d => [moment(d).subtract(2, 'months'), moment(d).add(2, 'months')],
  '6 Months': d => [moment(d).subtract(6, 'months'), moment(d).add(6, 'months')],
  '1 Year': d => [moment(d).subtract(1, 'years'), moment(d).add(1, 'years')],
};

export const getInitialFilterVal = (f) => {
  if (f.type === FILTER_TYPES.DROPDOWN) {
    return [];
  }
  if (f.type === FILTER_TYPES.DATE) {
    return {
      min: '',
      max: '',
      range: '1 Week',
      selectedDefault: 'Within',
    };
  }
  return '';
};

export const getChipLabel = (f) => {
  switch (f.type) {
  case (FILTER_TYPES.TEXT_AUTOCOMPLETE):
  case (FILTER_TYPES.TEXT): {
    return `${f.displayName} includes '${f.value}'`;
  }
  case (FILTER_TYPES.DROPDOWN): {
    const displayChoices = {};
    if (typeof f.choices === 'object') {
      Object.entries(f.choices).forEach(([k, v]) => { displayChoices[v] = k; });
    } else if (f.choices instanceof Array) {
      f.choices.forEach((c) => { displayChoices[c] = c; });
    }
    let displayString = `'${displayChoices[f.value[0]]}'`;
    f.value.forEach((v, i) => {
      if (i === 0) { return undefined; }
      displayString += i === f.value.length - 1 ? ` or '${displayChoices[f.value[i]]}'` : `, '${displayChoices[f.value[i]]}'`;
      return '';
    });
    return `${f.displayName} is ${displayString}`;
  }
  case (FILTER_TYPES.DATE): {
    return `${f.displayName} is within ${f.value.range} of ${new Date(f.value.value).toLocaleDateString()}`;
  }
  default: {
    return `${f.displayName}`;
  }
  }
};