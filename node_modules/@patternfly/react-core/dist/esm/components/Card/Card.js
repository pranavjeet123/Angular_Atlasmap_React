import { __rest } from "tslib";
import * as React from 'react';
import styles from '@patternfly/react-styles/css/components/Card/card';
import { css } from '@patternfly/react-styles';
import { useOUIAProps } from '../../helpers';
export const CardContext = React.createContext({
    cardId: '',
    isExpanded: false
});
export const Card = (_a) => {
    var { children = null, id = '', className = '', component = 'article', isHoverable = false, isCompact = false, isSelectable = false, isSelectableRaised = false, isSelected = false, isDisabledRaised = false, isFlat = false, isExpanded = false, isRounded = false, isLarge = false, isFullHeight = false, isPlain = false, ouiaId, ouiaSafe = true } = _a, props = __rest(_a, ["children", "id", "className", "component", "isHoverable", "isCompact", "isSelectable", "isSelectableRaised", "isSelected", "isDisabledRaised", "isFlat", "isExpanded", "isRounded", "isLarge", "isFullHeight", "isPlain", "ouiaId", "ouiaSafe"]);
    const Component = component;
    const ouiaProps = useOUIAProps(Card.displayName, ouiaId, ouiaSafe);
    if (isCompact && isLarge) {
        // eslint-disable-next-line no-console
        console.warn('Card: Cannot use isCompact with isLarge. Defaulting to isCompact');
        isLarge = false;
    }
    const getSelectableModifiers = () => {
        if (isDisabledRaised) {
            return css(styles.modifiers.nonSelectableRaised);
        }
        if (isSelectableRaised) {
            return css(styles.modifiers.selectableRaised, isSelected && styles.modifiers.selectedRaised);
        }
        if (isSelectable || isHoverable) {
            return css(styles.modifiers.selectable, isSelected && styles.modifiers.selected);
        }
        return '';
    };
    return (React.createElement(CardContext.Provider, { value: {
            cardId: id,
            isExpanded
        } },
        React.createElement(Component, Object.assign({ id: id, className: css(styles.card, isCompact && styles.modifiers.compact, isExpanded && styles.modifiers.expanded, isFlat && styles.modifiers.flat, isRounded && styles.modifiers.rounded, isLarge && styles.modifiers.displayLg, isFullHeight && styles.modifiers.fullHeight, isPlain && styles.modifiers.plain, getSelectableModifiers(), className), tabIndex: isSelectable || isSelectableRaised ? '0' : undefined }, props, ouiaProps), children)));
};
Card.displayName = 'Card';
//# sourceMappingURL=Card.js.map