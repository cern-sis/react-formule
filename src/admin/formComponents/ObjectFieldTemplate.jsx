import { useState, useEffect, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import RenderSortable from "./RenderSortable";
import update from "immutability-helper";
import { useDispatch } from "react-redux";
import { updateUiSchemaByPath } from "../../store/schemaWizard";
import CustomizationContext from "../../contexts/CustomizationContext";
import RenderFieldWithArrows from "./RenderFieldWithArrows";

const ObjectFieldTemplate = ({
  properties,
  uiSchema,
  formContext,
  idSchema,
}) => {
  const [cards, setCards] = useState([]);

  const dispatch = useDispatch();

  const customizationContext = useContext(CustomizationContext);

  useEffect(
    () => {
      let propertiesLength = properties.length;
      let cardsLength = cards.length;

      // if there is difference between the two arrays means that something changed
      // an item might be deleted, and we want to re fetch everything from properties and update the cards
      if (propertiesLength < cardsLength) {
        let temp = [];
        properties.map((prop, index) => {
          let item = {
            id: index + 1,
            name: prop.name,
            prop: prop,
          };

          temp.push(item);
        });
        setCards(temp);
      }

      // if there is no change with the number of the items it means that either there is a re ordering
      // or some update at each props data
      if (propertiesLength === cardsLength) {
        let uiCards = cards.map((item) => item.name);
        let uiProperties = properties.map((item) => item.name);
        let different;
        uiProperties.map((item) => {
          if (!uiCards.includes(item)) {
            different = item;
          }
        });

        const newCards = [...cards];

        // the different variable will define if there was a change in the prop keys or there is just a re ordering
        if (different) {
          let diffIndex;
          uiCards.map((item, index) => {
            if (!uiProperties.includes(item)) diffIndex = index;
          });

          let itemProps;
          properties.map((item) => {
            if (item.name === different) itemProps = item;
          });

          let item = {
            id: diffIndex + 1,
            name: different,
            prop: itemProps,
          };
          newCards[diffIndex] = item;
        } else {
          newCards.map((card, index) => {
            card.prop = properties[index];
          });
        }
        setCards(newCards);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [properties],
  );

  // Updates the uiSchema after the cards update with the new ui:order
  // (so that the form preview displays the correct order)
  useEffect(() => {
    let uiCards = cards.map((item) => item.name);
    let uiProperties = properties.map((item) => item.name);
    let { ...rest } = uiSchema;

    uiCards = uiProperties.length < uiCards.length ? uiProperties : uiCards;

    dispatch(
      updateUiSchemaByPath({
        path: formContext.uiSchema.length > 0 ? formContext.uiSchema : [],
        value: {
          ...rest,
          "ui:order": [...uiCards, "*"],
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  // create a new array to keep track of the changes in the order
  properties.map((prop, index) => {
    if (index != cards.length) {
      return;
    }

    let item = {
      id: index + 1,
      name: prop.name,
      prop: prop,
    };

    setCards([...cards, item]);
  });

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      const dragCard = cards[dragIndex];
      if (dragCard) {
        setCards(
          update(cards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, dragCard],
            ],
          }),
        );
      }
    },
    [cards],
  );

  if (idSchema.$id == "root") {
    return customizationContext.dnd
      ? cards.map((card, i) =>
          RenderSortable(formContext.uiSchema, card, i, moveCard),
        )
      : cards.map((card, i) => RenderFieldWithArrows(card, cards, i, moveCard));
  }
};

ObjectFieldTemplate.propTypes = {
  idSchema: PropTypes.object,
  properties: PropTypes.array,
  formContext: PropTypes.object,
  onUiSchemaChange: PropTypes.func,
  uiSchema: PropTypes.object,
};

export default ObjectFieldTemplate;
