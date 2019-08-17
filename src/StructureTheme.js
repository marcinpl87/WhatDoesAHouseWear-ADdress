import React from 'react';
import ReactDOM from 'react-dom';

class StructureTheme extends React.Component {
    render() {
        var colorsSolid = [
            ['bg-primary',      'light'],
            ['bg-secondary',    'light'],
            ['bg-success',      'dark'],
            ['bg-info',         'dark'],
            ['bg-warning',      'dark'],
            ['bg-danger',       'light'],
            ['bg-light',        'dark'],
            ['bg-dark',         'light'],
            ['bg-focus',        'light'],
            ['bg-alternate',    'light']
        ];
        var colorsGradient = [
            ['bg-vicious-stance',   'light'],
            ['bg-midnight-bloom',   'light'],
            ['bg-night-sky',        'light'],
            ['bg-slick-carbon',     'light'],
            ['bg-asteroid',         'light'],
            ['bg-royal',            'light'],
            ['bg-warm-flame',       'dark'],
            ['bg-night-fade',       'dark'],
            ['bg-sunny-morning',    'dark'],
            ['bg-tempting-azure',   'dark'],
            ['bg-amy-crisp',        'dark'],
            ['bg-heavy-rain',       'dark'],
            ['bg-mean-fruit',       'dark'],
            ['bg-malibu-beach',     'light'],
            ['bg-deep-blue',        'dark'],
            ['bg-ripe-malin',       'light'],
            ['bg-arielle-smile',    'light'],
            ['bg-plum-plate',       'light'],
            ['bg-happy-fisher',     'dark'],
            ['bg-happy-itmeo',      'light'],
            ['bg-mixed-hopes',      'light'],
            ['bg-strong-bliss',     'light'],
            ['bg-grow-early',       'light'],
            ['bg-love-kiss',        'light'],
            ['bg-premium-dark',     'light'],
            ['bg-happy-green',      'light']
        ];
        return (
            <div className="ui-theme-settings">
                <button type="button" id="TooltipDemo" className="btn-open-options btn btn-warning">
                    <i className="fa fa-cog fa-w-16 fa-spin fa-2x"></i>
                </button>
                <div className="theme-settings__inner">
                    <div className="scrollbar-container">
                        <div className="theme-settings__options-wrapper">
                            <h3 className="themeoptions-heading">
                                <div>Menu górne</div>
                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-header-cs-class" data-class="">
                                    Ustawienia domyślne
                                </button>
                            </h3>
                            <div className="p-3">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="theme-settings-swatches">
                                            {colorsSolid.map((cl, i) => {
                                                return <div
                                                    key={i}
                                                    className={`swatch-holder switch-header-cs-class ${cl[0]}`}
                                                    data-class={`${cl[0]} header-text-${cl[1]}`}></div>
                                            })}
                                            <div className="divider"></div>
                                            {colorsGradient.map((cl, i) => {
                                                return <div
                                                    key={i}
                                                    className={`swatch-holder switch-header-cs-class ${cl[0]}`}
                                                    data-class={`${cl[0]} header-text-${cl[1]}`}></div>
                                            })}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <h3 className="themeoptions-heading">
                                <div>Panel boczny</div>
                                <button type="button" className="btn-pill btn-shadow btn-wide ml-auto btn btn-focus btn-sm switch-sidebar-cs-class" data-class="">
                                    Ustawienia domyślne
                                </button>
                            </h3>
                            <div className="p-3">
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <div className="theme-settings-swatches">
                                            {colorsSolid.map((cl, i) => {
                                                return <div
                                                    key={i}
                                                    className={`swatch-holder switch-sidebar-cs-class ${cl[0]}`}
                                                    data-class={`${cl[0]} sidebar-text-${cl[1]}`}></div>
                                            })}
                                            <div className="divider"></div>
                                            {colorsGradient.map((cl, i) => {
                                                return <div
                                                    key={i}
                                                    className={`swatch-holder switch-sidebar-cs-class ${cl[0]}`}
                                                    data-class={`${cl[0]} sidebar-text-${cl[1]}`}></div>
                                            })}
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StructureTheme;
