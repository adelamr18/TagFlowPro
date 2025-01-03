import TableWrapper from "components/Tables/TableWrapper";
import { Button } from "reactstrap";
import { TAGS_PLACEHOLDER } from "shared/consts";
import { Tag } from "types/Tag";

interface TagsManagementTableProps {
  tags: Tag[];
  currentPage: number;
  totalPages: number;
  paginateTagsTable: (page: number) => void;
  openEditTagModal: (tag: Tag) => void;
  openTagValuesModal: (tag: Tag) => void;
  toggleAddTagModal: () => void;
  handleDeleteOuterTag: (tag: Tag) => void;
  onSearch: (searchQuery: string) => void;
}

const TagsManagementTable = ({
  tags,
  currentPage,
  totalPages,
  paginateTagsTable,
  openEditTagModal,
  openTagValuesModal,
  toggleAddTagModal,
  handleDeleteOuterTag,
  onSearch,
}: TagsManagementTableProps) => {
  const columns = [
    { header: "Tag Name", accessor: "tagName" },
    {
      header: "Tag Values",
      accessor: "tagValues",
      render: (tag: Tag) => {
        const { tagValues } = tag;
        return tagValues.length > 3 ? (
          <>
            {tagValues.slice(0, 3).join(", ")}{" "}
            <Button
              color="link"
              style={{ color: "blue", textDecoration: "underline" }}
              onClick={() => openTagValuesModal(tag)}
            >
              +{tagValues.length - 3} more
            </Button>
          </>
        ) : (
          tagValues.join(", ")
        );
      },
    },
    { header: "Created By", accessor: "createdByEmail" },
    {
      header: "Assigned Users",
      accessor: "assignedUsers",
      render: (tag: Tag) =>
        tag.assignedUsers.length > 0
          ? tag.assignedUsers.join(", ")
          : "No assigned users",
    },
    { header: "Updated By", accessor: "updatedBy" },
    {
      header: "Actions",
      accessor: "",
      render: (tag: Tag) => (
        <>
          <Button color="primary" onClick={() => openEditTagModal(tag)}>
            Edit
          </Button>
          <Button
            color="danger"
            onClick={() => handleDeleteOuterTag(tag)}
            className="ml-2"
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <TableWrapper
      title="Tags Management"
      columns={columns}
      data={tags}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={paginateTagsTable}
      toggleAddModal={toggleAddTagModal}
      canShowAddButton={true}
      addButtonHeader="Add New Tag"
      searchPlaceholder={TAGS_PLACEHOLDER}
      onSearch={onSearch}
    />
  );
};

export default TagsManagementTable;
