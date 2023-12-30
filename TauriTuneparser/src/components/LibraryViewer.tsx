import { Box, Button, useToast, Select } from '@chakra-ui/react';
import React, { ChangeEvent, useCallback, useState } from 'react';

import useLibraryContext from 'src/hooks/useLibraryContext';
import { Graphs } from 'src/types/types';
import IndexedDB from 'src/utils/database';
import GenrePie from './Charts/GenrePie';

const GRAPH_COMPONENT_MAP: Record<Graphs, React.ReactNode> = {
  [Graphs.genrePie]: <GenrePie />,
};

export default function LibraryViewer() {
  const [selectedGraph, setSelectedGraph] = useState<Graphs | null>(null);
  const { setLibrary } = useLibraryContext();
  const toast = useToast();

  const handleSelectGraph = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const choice = (e.target.value as Graphs) ?? null;

    setSelectedGraph(choice);
  }, []);

  const handleUnload = useCallback(async () => {
    await IndexedDB.clear();

    toast({
      title: 'Library unloaded',
      description: 'Select another library to get started',
    });

    setLibrary([]);
  }, []);

  return (
    <Box w="full" h="full">
      <Select placeholder="Select a graph" onChange={handleSelectGraph}>
        <option value={Graphs.genrePie}>Genre pie</option>
      </Select>
      {selectedGraph && (
        <Box minH="40vh" w="full">
          {GRAPH_COMPONENT_MAP[selectedGraph]}
        </Box>
      )}
      You are in the library
      <Button onClick={handleUnload}>Unload</Button>
    </Box>
  );
}
