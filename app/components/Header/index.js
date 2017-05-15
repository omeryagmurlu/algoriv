import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { header } from './style.scss';

const trace = a => {
	console.log(a);
	return a;
};

const Header = props => (
	<header className={header}>
		<FlatButton label={`Back ${(props).back.name}`} onTouchTap={() => { console.log('sdfsdsfsdfdsfdsfsf');props.goBack()}} />
		<nav>
			{props.routes.map(route => (
				<FlatButton label={(route).name} onTouchTap={() => props.changeView(route)} />
			))}
		</nav>
	</header>
);

export default Header;
