import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

interface TagValuesModalProps {
  isOpen: boolean;
  toggle: () => void;
  tagValues: string;
}

const TagValuesModal: React.FC<TagValuesModalProps> = ({
  isOpen,
  toggle,
  tagValues,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Tag Values</ModalHeader>
      <ModalBody>
        <div
          id="tagValues"
          style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
        >
          {tagValues.split("\n").map((value, index) => (
            <ul key={index}>
              <li>{value}</li>
            </ul>
          ))}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TagValuesModal;
