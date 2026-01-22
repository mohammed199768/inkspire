import os

def collect_code():
    include_dirs = ['app', 'components', 'hooks', 'lib', 'data', 'types', 'styles']
    exclude_dirs = ['node_modules', '.next', 'out', '.git']
    extensions = ['.ts', '.tsx', '.js', '.jsx', '.css']
    output_file = 'project_source_code.txt'
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for root, dirs, files in os.walk('.'):
            # Prune exclude dirs
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            # Check if current root is in an include dir or root
            relative_root = os.path.relpath(root, '.')
            is_root = relative_root == '.'
            top_dir = relative_root.split(os.sep)[0]
            
            if not is_root and top_dir not in include_dirs:
                continue
                
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(f"\n{'='*80}\n")
                            outfile.write(f"FILE: {file_path}\n")
                            outfile.write(f"{'='*80}\n\n")
                            outfile.write(infile.read())
                            outfile.write("\n\n")
                    except Exception as e:
                        outfile.write(f"Could not read file {file_path}: {e}\n")

if __name__ == "__main__":
    collect_code()
