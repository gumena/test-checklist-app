'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChecklistItemWithChildren, Priority, ItemStatus } from '@/types';
import ChecklistItem from './ChecklistItem';

interface ChecklistTreeProps {
  items: ChecklistItemWithChildren[];
  onItemsReorder: (items: ChecklistItemWithChildren[]) => void;
  onEdit: (item: ChecklistItemWithChildren) => void;
  onDelete: (itemId: string) => void;
  onDuplicate: (itemId: string) => void;
  onAddChild: (parentId: string) => void;
  selectedItems: Set<string>;
  onSelectItem: (itemId: string, selected: boolean) => void;
}

function SortableItem({
  item,
  depth = 0,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onAddChild,
}: {
  item: ChecklistItemWithChildren;
  depth?: number;
  isSelected: boolean;
  onSelect: (itemId: string, selected: boolean) => void;
  onEdit: (item: ChecklistItemWithChildren) => void;
  onDelete: (itemId: string) => void;
  onDuplicate: (itemId: string) => void;
  onAddChild: (parentId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-2">
      <ChecklistItem
        item={item}
        depth={depth}
        isSelected={isSelected}
        onSelect={onSelect}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onAddChild={onAddChild}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      {/* Render children */}
      {item.children && item.children.length > 0 && (
        <div className="mt-2">
          {item.children.map((child) => (
            <SortableItem
              key={child.id}
              item={child}
              depth={depth + 1}
              isSelected={isSelected}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChecklistTree({
  items,
  onItemsReorder,
  onEdit,
  onDelete,
  onDuplicate,
  onAddChild,
  selectedItems,
  onSelectItem,
}: ChecklistTreeProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Flatten items for reordering (only root level for now)
    const flatItems = items.filter((item) => !item.parent_id);
    const oldIndex = flatItems.findIndex((item) => item.id === active.id);
    const newIndex = flatItems.findIndex((item) => item.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedItems = arrayMove(flatItems, oldIndex, newIndex);
      onItemsReorder(reorderedItems);
    }
  };

  // Get only root level items for drag-drop
  const rootItems = items.filter((item) => !item.parent_id);

  if (items.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rootItems.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {rootItems.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              isSelected={selectedItems.has(item.id)}
              onSelect={onSelectItem}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
