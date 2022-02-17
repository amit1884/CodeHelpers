import { useRouter } from 'next/router';

const PossibleLocations = [
  'scholarship',
  'study-abroad',
  'canada',
  'usa',
  'australia',
  'uk',
  'germany',
  'ireland',
  'malaysia',
  'netherlands',
  'new-zealand',
  'singapore',
  'sweden',
  'hong-kong',
  'comparison',
  'uae',
];

export const checkSaPage = (url = '') => {
  let router = '';
  let asPath = '';
  if (url === '') {
    router = useRouter();
    asPath = router.asPath;
  } else {
    asPath = url;
  }

  let countryName = asPath.split('#')[0];

  try {
    if (asPath.includes('?')) {
      countryName = asPath.split('?')[0];
    }
    countryName = countryName.substring(1);
    if (countryName.includes('/')) {
      countryName = countryName.split('/')[0];
    }
    if (countryName != '') {
      countryName = countryName.replace('-colleges', '');
    }
    if (countryName === 'scholarship') {
      countryName = 'study-abroad';
    }
  } catch (error) {
    console.log(error);
  }

  const isSaPage = PossibleLocations.includes(countryName.toLowerCase()) ? countryName == 'comparison' ? 'study-abroad' : countryName : false;

  return isSaPage;
};

export const ListingPossibleLocations = [
  'study-abroad',
  'canada',
  'usa',
  'australia',
  'uk',
  'germany',
  'ireland',
  'malaysia',
  'netherlands',
  'new-zealand',
  'singapore',
  'sweden',
  'hong-kong',
  'uae'
];

export const MobileListingPossibleLocations = [
  {
    name: 'CANADA',
    text: 'Canada',
    link: 'canada-colleges',
    value: 1,
  },
  {
    name: 'USA',
    text: 'USA',
    link: 'usa-colleges',
    value: 13,
  }, {
    name: 'AUSTRALIA',
    text: 'Australia',
    link: 'australia-colleges',
    value: 3,
  },
  {
    name: 'UK',
    text: 'UK',
    link: 'uk-colleges',
    value: 12,
  },

  {
    name: 'GERMANY',
    text: 'Germany',
    link: 'germany-colleges',
    value: 4,
  },
  {
    name: 'ireland',
    text: 'Ireland',
    link: 'ireland-colleges',
    value: 6,
  },
  {
    name: 'malaysia',
    text: 'Malaysia',
    link: 'malaysia-colleges',
    value: 7,
  },
  {
    name: 'NETHERLANDS',
    text: 'Netherlands',
    link: 'netherlands-colleges',
    value: 8,
  },

  {
    name: 'NEW-ZEALAND',
    text: 'New Zealand',
    link: 'new-zealand-colleges',
    value: 9,
  },
  {
    name: 'singapore',

    text: 'Singapore',
    link: 'singapore-colleges',
    value: 10,
  },
  {
    name: 'SWEDEN',
    text: 'Sweden',
    link: 'sweden-colleges',
    value: 11,
  },
  {
    name: 'hong-kong',
    text: 'Hong Kong',
    link: 'hong-kong-colleges',
    value: 5,
  },
  {
    name: 'uae',
    text: 'UAE',
    link: 'uae-colleges',
    value: 115,
  },
  {
    name: 'study-abroad',
    text: 'All Countries',
    link: 'study-abroad-colleges',
    value: '',
  },
];

export const UrlGenPossibleLocations = [
  'canada',
  'usa',
  'australia',
  'uk',
  'germany',
  'ireland',
  'malaysia',
  'netherlands',
  'new-zealand',
  'singapore',
  'sweden',
  'hong-kong',
  'study-abroad',
  'uae'
];

export const NicheArticlesPossibleLocations = [
  'canada',
  'usa',
  'australia',
  'uk',
  'germany',
  'ireland',
  'malaysia',
  'netherlands',
  'new-zealand',
  'singapore',
  'sweden',
  'hong-kong',
  'study-abroad',
  'uae'
];
