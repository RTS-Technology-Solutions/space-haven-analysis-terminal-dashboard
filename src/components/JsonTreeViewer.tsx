import { useState } from 'react'
import './JsonTreeViewer.css'

interface JsonTreeViewerProps {
  data: any
  rootLabel?: string
}

interface TreeNodeProps {
  keyName: string
  value: any
  level: number
  path: string
}

const TreeNode = ({ keyName, value, level, path }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(level === 0) // Only root expanded by default
  
  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value)
  const isArray = Array.isArray(value)
  const isExpandable = isObject || isArray
  
  const indent = level * 20
  
  // Get preview text for collapsed nodes
  const getPreview = () => {
    if (isArray) {
      return `Array(${value.length})`
    }
    if (isObject) {
      const keys = Object.keys(value)
      return `{${keys.length} ${keys.length === 1 ? 'key' : 'keys'}}`
    }
    if (typeof value === 'string') {
      return value.length > 50 ? `"${value.substring(0, 50)}..."` : `"${value}"`
    }
    if (value === null) return 'null'
    if (value === undefined) return 'undefined'
    return String(value)
  }
  
  // Get type indicator
  const getTypeIndicator = () => {
    if (isArray) return '[]'
    if (isObject) return '{}'
    if (typeof value === 'string') return 'string'
    if (typeof value === 'number') return 'number'
    if (typeof value === 'boolean') return 'bool'
    return typeof value
  }
  
  const toggleExpand = () => {
    if (isExpandable) {
      setIsExpanded(!isExpanded)
    }
  }
  
  return (
    <div className="json-tree-node">
      <div 
        className={`json-tree-line ${isExpandable ? 'expandable' : ''}`}
        style={{ paddingLeft: `${indent}px` }}
        onClick={toggleExpand}
      >
        {isExpandable && (
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▶
          </span>
        )}
        {!isExpandable && <span className="expand-icon-spacer"></span>}
        
        <span className="json-key">{keyName}:</span>
        
        <span className={`json-type type-${getTypeIndicator()}`}>
          {getTypeIndicator()}
        </span>
        
        {!isExpanded && isExpandable && (
          <span className="json-preview">{getPreview()}</span>
        )}
        
        {!isExpandable && (
          <span className={`json-value value-${typeof value}`}>
            {getPreview()}
          </span>
        )}
        
        <span className="json-path" title={path}>
          {path}
        </span>
      </div>
      
      {isExpanded && isExpandable && (
        <div className="json-tree-children">
          {isArray ? (
            value.map((item: any, index: number) => (
              <TreeNode
                key={index}
                keyName={`[${index}]`}
                value={item}
                level={level + 1}
                path={`${path}[${index}]`}
              />
            ))
          ) : (
            Object.entries(value).map(([key, val]) => (
              <TreeNode
                key={key}
                keyName={key}
                value={val}
                level={level + 1}
                path={`${path}.${key}`}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default function JsonTreeViewer({ data, rootLabel = 'root' }: JsonTreeViewerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <div className="json-tree-viewer">
      <div className="json-tree-controls">
        <input
          type="text"
          className="json-search"
          placeholder="Search keys or paths..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="json-tree-hint">
          💡 Click any line to expand/collapse
        </span>
      </div>
      
      <div className="json-tree-container">
        <TreeNode
          keyName={rootLabel}
          value={data}
          level={0}
          path={rootLabel}
        />
      </div>
    </div>
  )
}
