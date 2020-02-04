import * as React from 'react';
import { useState } from 'react';
import Dropdown, { DropdownAttrMode } from './Dropdown';
import { DropdownItemBaseProps } from './Item/DropdownItem';


interface City {
  id: string,
  name: string,
  lat: string,
  lon: string,
}

interface Street {
  id: string,
  name: string,
  country: string,
}

const dropdown1List: DropdownItemBaseProps<City>[] = [
  {
    id: '5c6eab2b804d782cd49614bd',
    name: 'Richmond',
    lat: '4.0824',
    lon: '6.0949'
  },
  {
    id: '5c6eab2ba9de4f9fce3cbc96',
    name: 'Brooktrails',
    lat: '9.2896',
    lon: '8.7924'
  },
  {
    id: '5c6eab2bc5723d967c148e62',
    name: 'Ogema',
    lat: '8.7567',
    lon: '9.1485'
  },
  {
    id: '5c6eab2b23928b8b7328f881',
    name: 'Clara',
    lat: '1.809',
    lon: '2.9399'
  },
  {
    id: '5c6eab2b2acc5dbaaba5feab',
    name: 'Campo',
    lat: '5.2011',
    lon: '9.5593'
  },
  {
    id: '5c6eab2bc8ee3b21291a95e7',
    name: 'Darlington',
    lat: '5.2966',
    lon: '8.797'
  },
  {
    id: '5c6eab2b3fbeca7fdde607c1',
    name: 'Klondike',
    lat: '4.7673',
    lon: '2.8251'
  },
  {
    id: '5c6eab2bf2c25dff0807bbd9',
    name: 'Robinson',
    lat: '9.64',
    lon: '1.4711'
  },
  {
    id: '5c6eab2b47b86ed4670e9225',
    name: 'Bergoo',
    lat: '9.0042',
    lon: '1.4578'
  },
  {
    id: '5c6eab2bf2bf5b65edadf753',
    name: 'Stockwell',
    lat: '9.8281',
    lon: '7.6281'
  },
  {
    id: '5c6eab2bb95023c7ad3df592',
    name: 'Wacissa',
    lat: '3.5538',
    lon: '6.8832'
  },
  {
    id: '5c6eab2bb48fc3399ac62745',
    name: 'Bangor',
    lat: '4.2547',
    lon: '4.8018'
  },
  {
    id: '5c6eab2b01dc5ba1079e9d89',
    name: 'Hiwasse',
    lat: '2.9249',
    lon: '2.6593'
  },
  {
    id: '5c6eab2b8901ef6de8c5d067',
    name: 'Zarephath',
    lat: '7.6302',
    lon: '9.3149'
  },
  {
    id: '5c6eab2bfb18c73e31211c24',
    name: 'Whitmer',
    lat: '3.1522',
    lon: '1.1554'
  },
  {
    id: '5c6eab2bb928f338bc74e454',
    name: 'Maury',
    lat: '0.5793',
    lon: '3.4811'
  },
  {
    id: '5c6eab2b9cf77083c7543545',
    name: 'Rutherford',
    lat: '7.2436',
    lon: '5.3394'
  },
  {
    id: '5c6eab2b36c9c2d43f255a9b',
    name: 'Avoca',
    lat: '0.6534',
    lon: '1.0558'
  },
  {
    id: '5c6eab2b94c729be179dfef3',
    name: 'Glenville',
    lat: '8.8594',
    lon: '6.1906'
  },
  {
    id: '5c6eab2bc6a54b61a8ca2a54',
    name: 'Orviston',
    lat: '2.9066',
    lon: '6.553'
  },
  {
    id: '5c6eab2bf1a0bef7da1f1c28',
    name: 'Elrama',
    lat: '4.6551',
    lon: '8.5738'
  },
  {
    id: '5c6eab2b640e58096b0d4701',
    name: 'Leming',
    lat: '7.5199',
    lon: '8.1928'
  },
  {
    id: '5c6eab2bf5c927aec14c2d09',
    name: 'Ventress',
    lat: '6.1814',
    lon: '0.4481'
  },
  {
    id: '5c6eab2b370fecdc3eec46db',
    name: 'Carlton',
    lat: '1.3678',
    lon: '0.1053'
  },
  {
    id: '5c6eab2b129a8ce3a14242df',
    name: 'Clay',
    lat: '6.2655',
    lon: '4.6371'
  },
  {
    id: '5c6eab2bd4666154c3d7c3f7',
    name: 'Westerville',
    lat: '3.5161',
    lon: '5.3996'
  },
  {
    id: '5c6eab2b0659d9acea579bda',
    name: 'Rockbridge',
    lat: '0.8069',
    lon: '5.9747'
  },
  {
    id: '5c6eab2bcd6be3a09898552a',
    name: 'Bynum',
    lat: '0.9028',
    lon: '5.8619'
  },
  {
    id: '5c6eab2b746461a9314810bf',
    name: 'Sylvanite',
    lat: '6.2013',
    lon: '9.0577'
  },
  {
    id: '5c6eab2b6ddc61bfa2918418',
    name: 'Ballico',
    lat: '2.5728',
    lon: '5.9577'
  },
  {
    id: '5c6eab2b71cc133e145b3a26',
    name: 'Rushford',
    lat: '1.8818',
    lon: '4.4094'
  },
  {
    id: '5c6eab2ba88ebdcb65ed2919',
    name: 'Marne',
    lat: '7.7314',
    lon: '7.7889'
  },
  {
    id: '5c6eab2b9b3df703cf6b3385',
    name: 'Newry',
    lat: '8.3412',
    lon: '8.8878'
  },
  {
    id: '5c6eab2b8d52eebbab692826',
    name: 'Gila',
    lat: '4.0879',
    lon: '7.9003'
  },
  {
    id: '5c6eab2b2f9510bb00bb53c3',
    name: 'Ebro',
    lat: '1.9327',
    lon: '9.6474'
  },
  {
    id: '5c6eab2b53c9fb83fad774b8',
    name: 'Englevale',
    lat: '8.5126',
    lon: '1.0423'
  },
  {
    id: '5c6eab2bfeb7a6c22b497eee',
    name: 'Delshire',
    lat: '5.4624',
    lon: '9.4721'
  },
  {
    id: '5c6eab2bed0844d7e0e8f979',
    name: 'Chase',
    lat: '7.7605',
    lon: '4.9294'
  },
  {
    id: '5c6eab2b2d561c9e87ab1a87',
    name: 'Lowgap',
    lat: '0.7193',
    lon: '0.9815'
  },
  {
    id: '5c6eab2be0f52b6937c4f1e2',
    name: 'Smock',
    lat: '4.9632',
    lon: '3.7842'
  },
  {
    id: '5c6eab2b515ded4a5ea5b573',
    name: 'Osmond',
    lat: '1.9236',
    lon: '0.5077'
  },
  {
    id: '5c6eab2bf585799f3f07e5b0',
    name: 'Brady',
    lat: '1.1952',
    lon: '8.9499'
  },
  {
    id: '5c6eab2b4e8258c9fc1fe323',
    name: 'Freelandville',
    lat: '6.9625',
    lon: '5.1517'
  },
  {
    id: '5c6eab2b5943e9858a800e5e',
    name: 'Herlong',
    lat: '6.6762',
    lon: '3.2853'
  },
  {
    id: '5c6eab2b30f6bc636bc0efca',
    name: 'Oasis',
    lat: '9.5068',
    lon: '6.4036'
  },
  {
    id: '5c6eab2be8d5bd05c38a9266',
    name: 'Wattsville',
    lat: '0.0002',
    lon: '9.0664'
  },
  {
    id: '5c6eab2b921d7f202bf515bf',
    name: 'Vandiver',
    lat: '7.67',
    lon: '8.4971'
  },
  {
    id: '5c6eab2b4cd5915ce9b17121',
    name: 'Greenfields',
    lat: '1.8472',
    lon: '5.7927'
  },
  {
    id: '5c6eab2b7197c7c5cd42557e',
    name: 'Lavalette',
    lat: '3.918',
    lon: '7.9513'
  },
  {
    id: '5c6eab2bfef0abcf8dc09f38',
    name: 'Virgie',
    lat: '5.3624',
    lon: '8.593'
  },
  {
    id: '5c6eab2b37c41db020386df6',
    name: 'Charco',
    lat: '4.8924',
    lon: '3.3724'
  },
  {
    id: '5c6eab2b3014569e1f42b219',
    name: 'Dixie',
    lat: '2.0873',
    lon: '1.5155'
  },
  {
    id: '5c6eab2b98f454ecc0e7d5d6',
    name: 'Blodgett',
    lat: '3.7474',
    lon: '4.8499'
  },
  {
    id: '5c6eab2b5d2242311e3f7ef7',
    name: 'Grill',
    lat: '2.763',
    lon: '3.4728'
  },
  {
    id: '5c6eab2b627df178c891011f',
    name: 'Denio',
    lat: '9.7996',
    lon: '7.4109'
  },
  {
    id: '5c6eab2b4533c6c4fde3d4b8',
    name: 'Elliston',
    lat: '4.235',
    lon: '9.1113'
  },
  {
    id: '5c6eab2b3b97e9f769578dbe',
    name: 'Johnsonburg',
    lat: '0.8299',
    lon: '6.4578'
  },
  {
    id: '5c6eab2b1aa14922944c1fd0',
    name: 'Bentonville',
    lat: '5.1367',
    lon: '7.7548'
  },
  {
    id: '5c6eab2b8b7ab2c96778efb9',
    name: 'Gardners',
    lat: '8.3863',
    lon: '0.0023'
  },
  {
    id: '5c6eab2b83c3e7a583591317',
    name: 'Calvary',
    lat: '2.8636',
    lon: '1.9383'
  },
  {
    id: '5c6eab2b2e054234fb21427a',
    name: 'Hilltop',
    lat: '1.2243',
    lon: '1.5958'
  },
  {
    id: '5c6eab2b81b1059c599e5cf4',
    name: 'Defiance',
    lat: '7.6706',
    lon: '8.2286'
  },
  {
    id: '5c6eab2b80b64eb97a891a69',
    name: 'Blandburg',
    lat: '2.4576',
    lon: '4.6612'
  },
  {
    id: '5c6eab2bd60d7228caf8690a',
    name: 'Rodanthe',
    lat: '9.6349',
    lon: '8.1748'
  },
  {
    id: '5c6eab2b0984367ce751d1cb',
    name: 'Thornport',
    lat: '1.2101',
    lon: '9.2624'
  },
  {
    id: '5c6eab2b562884ef1519d444',
    name: 'Blende',
    lat: '0.7073',
    lon: '4.4148'
  },
  {
    id: '5c6eab2b1c45029c338fa36a',
    name: 'Malott',
    lat: '2.2728',
    lon: '2.9414'
  },
  {
    id: '5c6eab2be10d3423bfbb96a2',
    name: 'Coral',
    lat: '8.3596',
    lon: '0.3475'
  },
  {
    id: '5c6eab2be5651626d7d712fe',
    name: 'Ferney',
    lat: '9.1964',
    lon: '2.0699'
  },
  {
    id: '5c6eab2b2bddd4cf02749ad5',
    name: 'Wakulla',
    lat: '1.883',
    lon: '7.8017'
  },
  {
    id: '5c6eab2b3a9c8b9b6e9bb77a',
    name: 'Aberdeen',
    lat: '8.5817',
    lon: '6.0468'
  },
  {
    id: '5c6eab2b95255478a5f76d18',
    name: 'Northridge',
    lat: '6.7633',
    lon: '9.4213'
  },
  {
    id: '5c6eab2b81100841487fc82f',
    name: 'Grazierville',
    lat: '7.1954',
    lon: '7.1237'
  },
  {
    id: '5c6eab2b54dd6680d5388d8c',
    name: 'Cowiche',
    lat: '9.9364',
    lon: '6.786'
  },
  {
    id: '5c6eab2b469651e90d5e7c8f',
    name: 'Elliott',
    lat: '2.9914',
    lon: '3.4332'
  },
  {
    id: '5c6eab2bb353fd63f3bb5d31',
    name: 'Grahamtown',
    lat: '9.6642',
    lon: '1.8416'
  },
  {
    id: '5c6eab2be46751ec8660ba85',
    name: 'Orick',
    lat: '3.4',
    lon: '4.6154'
  },
  {
    id: '5c6eab2b31fdc903d9eb8e65',
    name: 'Fingerville',
    lat: '7.9893',
    lon: '9.7408'
  },
  {
    id: '5c6eab2baf3b8cf905c20160',
    name: 'Helen',
    lat: '8.0678',
    lon: '5.1567'
  },
  {
    id: '5c6eab2bdfbe60b965f9a38c',
    name: 'Clarksburg',
    lat: '1.4791',
    lon: '4.0752'
  },
  {
    id: '5c6eab2b9fe6c002dc14323b',
    name: 'Fairhaven',
    lat: '9.368',
    lon: '9.3848'
  },
  {
    id: '5c6eab2b741afffd4a31b02f',
    name: 'Sultana',
    lat: '8.6448',
    lon: '6.2974'
  },
  {
    id: '5c6eab2b30cce30cf1210c8b',
    name: 'Layhill',
    lat: '6.0114',
    lon: '7.3987'
  },
  {
    id: '5c6eab2b05e99505f54d1f76',
    name: 'Lawrence',
    lat: '9.7144',
    lon: '0.4265'
  },
  {
    id: '5c6eab2b813f75d489838eca',
    name: 'Haena',
    lat: '2.8083',
    lon: '7.0086'
  },
  {
    id: '5c6eab2bc553d6cc6d43b941',
    name: 'Southmont',
    lat: '3.3844',
    lon: '2.8914'
  },
  {
    id: '5c6eab2b1e663e53953fdd14',
    name: 'Bagtown',
    lat: '3.7365',
    lon: '8.4331'
  },
  {
    id: '5c6eab2b4fdab5f5803c1d30',
    name: 'Hamilton',
    lat: '0.8318',
    lon: '6.6662'
  },
  {
    id: '5c6eab2b6c323b32e79b5cf3',
    name: 'Castleton',
    lat: '8.7693',
    lon: '8.8643'
  },
  {
    id: '5c6eab2b5930c4807bd2a5dd',
    name: 'Cumminsville',
    lat: '4.424',
    lon: '6.2721'
  },
  {
    id: '5c6eab2b68b4455952eace87',
    name: 'Fairlee',
    lat: '9.8011',
    lon: '0.1064'
  },
  {
    id: '5c6eab2b191c609448ca174a',
    name: 'Goldfield',
    lat: '2.6956',
    lon: '8.8527'
  },
  {
    id: '5c6eab2b7796d658a31d14bd',
    name: 'Henrietta',
    lat: '9.8339',
    lon: '8.3305'
  },
  {
    id: '5c6eab2b113b9d697090d869',
    name: 'Franklin',
    lat: '1.0091',
    lon: '0.0665'
  },
  {
    id: '5c6eab2bc8e0994e17b752d5',
    name: 'Leland',
    lat: '0.8178',
    lon: '3.0826'
  },
  {
    id: '5c6eab2b343e632fda2ece4e',
    name: 'Thermal',
    lat: '7.3988',
    lon: '4.8487'
  },
  {
    id: '5c6eab2bf4fb87a54d43b292',
    name: 'Dana',
    lat: '5.6231',
    lon: '1.3365'
  },
  {
    id: '5c6eab2b2711bd2c347a2a7d',
    name: 'Courtland',
    lat: '6.0448',
    lon: '2.5485'
  },
  {
    id: '5c6eab2be04a1f317472cf50',
    name: 'Vallonia',
    lat: '3.7948',
    lon: '3.1194'
  },
  {
    id: '5c6eab2bff44d1248cd3929d',
    name: 'Allentown',
    lat: '0.4185',
    lon: '2.3669'
  }
].map(city => ({
  id: city.id,
  label: city.name,
  datum: city,
}));

const dropdown2List: DropdownItemBaseProps<Street>[] = [
  {
    id: '5c6ea8a37b4bffdaf278cd6c',
    name: 'Livonia Avenue',
    country: 'Ukraine'
  },
  {
    id: '5c6ea8a3f06a29e18374c44e',
    name: 'Monitor Street',
    country: 'Egypt'
  },
  {
    id: '5c6ea8a3595a499429d944a7',
    name: 'Ryerson Street',
    country: 'Romania'
  },
  {
    id: '5c6ea8a39bb5f40bc6f7c885',
    name: 'Seba Avenue',
    country: 'Antigua and Barbuda'
  },
  {
    id: '5c6ea8a321491351a6d2ba89',
    name: 'Cameron Court',
    country: 'Rwanda'
  },
  {
    id: '5c6ea8a3dd3a6553c549410c',
    name: 'Chase Court',
    country: 'Sudan'
  },
  {
    id: '5c6ea8a320696e526ea54def',
    name: 'Catherine Street',
    country: 'Hong Kong'
  },
  {
    id: '5c6ea8a3208fcd7e95d9efd0',
    name: 'Harbor Court',
    country: 'Cayman Islands'
  },
  {
    id: '5c6ea8a388554a8b11facc82',
    name: 'Brighton Avenue',
    country: 'Bulgaria'
  },
  {
    id: '5c6ea8a3630346204cb0b1b9',
    name: 'Strauss Street',
    country: 'New Zealand'
  }
].map(street => ({
  id: street.id,
  label: street.name,
  datum: street,
}));

interface DropdownElementState {
  value?: string;
  loading: boolean;
}


function DropdownDoc() {
  const [dropdown1, setDropdown1] = useState<DropdownElementState>({
    value: undefined,
    loading: false,
  });
  const [dropdown2, setDropdown2] = useState<DropdownElementState>({
    value: undefined,
    loading: false,
  });

  return (
    <React.Fragment>
      <Dropdown
        identifier='dropdown-1'
        mode={DropdownAttrMode.FORM}
        label='Cities'
        disabled={false}
        loading={dropdown1.loading}
        helper='Cities from around the world'
        error=''
        value={dropdown1.value}
        noValueMessage='Please select a city'
        itemList={dropdown1List}
        loadingMessage='Loading cities'
        onChange={(selectedItem) => {
          setDropdown1({
            ...dropdown1,
            value: selectedItem.id,
          })
        }}
      />
      <Dropdown
        identifier='dropdown-1'
        mode={DropdownAttrMode.MENU}
        label='Drinks'
        disabled={false}
        loading={dropdown2.loading}
        helper='Drinks from around the world'
        error=''
        value={dropdown2.value}
        noValueMessage='Please select a drink'
        itemList={dropdown2List}
        loadingMessage='Loading drinks'
        onChange={(selectedItem) => {
          setDropdown2({
            ...dropdown2,
            value: selectedItem.id,
          })
        }}
      />
    </React.Fragment>
  );
}

export default DropdownDoc;
