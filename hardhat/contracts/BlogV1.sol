// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract BlogV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    struct Post {
        uint256 id;
        string cid;
        address author;
        uint256 createdAt;
        string category;
        bool isPublished;
        bool isDeleted;
    }

    mapping(uint256 => Post) private posts;
    mapping(string => uint256[]) private categoryPosts;
    mapping(address => uint256[]) private authorPosts;
    uint256[] private postIds;
    uint256 private _postIds;

    event PostCreated(
        uint256 indexed id,
        string indexed cid,
        address indexed author,
        string category
    );
    event PostUpdated(
        uint256 indexed id,
        string indexed cid,
        bool isPublished,
        string category
    );
    event PostDeleted(uint256 indexed id);

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal override onlyOwner {}

    function createPost(
        string calldata _cid,
        string calldata _category
    ) external {
        _postIds += 1;
        uint256 newPostId = _postIds;

        posts[newPostId] = Post({
            id: newPostId,
            cid: _cid,
            author: msg.sender,
            createdAt: block.timestamp,
            category: _category,
            isPublished: true,
            isDeleted: false
        });

        postIds.push(newPostId);
        categoryPosts[_category].push(newPostId);
        authorPosts[msg.sender].push(newPostId);

        emit PostCreated(newPostId, _cid, msg.sender, _category);
    }

    function updatePost(
        uint256 _id,
        string calldata _newCid,
        bool _isPublished,
        string calldata _newCategory
    ) external {
        Post storage post = posts[_id];
        require(
            post.author == msg.sender || msg.sender == owner(),
            "Not authorized to update"
        );

        post.cid = _newCid;
        post.isPublished = _isPublished;
        post.category = _newCategory;

        emit PostUpdated(_id, _newCid, _isPublished, _newCategory);
    }

    function deletePost(uint256 _id) external {
        Post storage post = posts[_id];
        require(
            post.author == msg.sender || msg.sender == owner(),
            "Not authorized to delete"
        );

        post.isDeleted = true;
        emit PostDeleted(_id);
    }

    function getPostsPaginated(
        uint256 startIndex,
        uint256 count,
        bool reverse,
        address authorFilter,
        string calldata categoryFilter,
        uint256 fromTimestamp,
        uint256 toTimestamp
    )
        external
        view
        returns (
            Post[] memory,
            uint256 nextStartIndex,
            bool hasMore,
            uint256 totalPosts
        )
    {
        uint256[] storage ids;
        if (authorFilter != address(0)) {
            ids = authorPosts[authorFilter];
        } else if (bytes(categoryFilter).length > 0) {
            ids = categoryPosts[categoryFilter];
        } else {
            ids = postIds;
        }

        uint256 total = ids.length;
        if (total == 0) {
            return (new Post[](0), 0, false, 0);
        }

        require(startIndex < total, "Start index out of bounds");

        if (fromTimestamp == 0) {
            fromTimestamp = 0; // Include all posts by default
        }
        if (toTimestamp == 0) {
            toTimestamp = block.timestamp; // Until now
        }

        uint256 validCount = 0;
        uint256[] memory validPostIds = new uint256[](total);

        if (!reverse) {
            for (uint256 i = startIndex; i < total; i++) {
                Post memory post = posts[ids[i]];
                if (
                    post.id != 0 &&
                    !post.isDeleted &&
                    post.createdAt >= fromTimestamp &&
                    post.createdAt <= toTimestamp
                ) {
                    validPostIds[validCount++] = ids[i];
                }
            }
        } else {
            for (uint256 i = total - 1; i >= startIndex; i--) {
                Post memory post = posts[ids[i]];
                if (
                    post.id != 0 &&
                    !post.isDeleted &&
                    post.createdAt >= fromTimestamp &&
                    post.createdAt <= toTimestamp
                ) {
                    validPostIds[validCount++] = ids[i];
                }
                if (i == 0) break; // Prevent underflow
            }
        }

        uint256 limit = count < validCount ? count : validCount;
        Post[] memory postsPage = new Post[](limit);

        for (uint256 i = 0; i < limit; i++) {
            postsPage[i] = posts[validPostIds[i]];
        }

        nextStartIndex = startIndex + limit;
        hasMore = (nextStartIndex < total);

        return (postsPage, nextStartIndex, hasMore, total);
    }

    function getPost(uint256 _id) external view returns (Post memory) {
        require(posts[_id].id != 0, "Post does not exist");
        return posts[_id];
    }
}
